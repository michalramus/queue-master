import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ClientResponseDto, ClientCreateDto, ClientUpdateDto } from "./dto/client.dto";
import { DatabaseService } from "src/database/database.service";
import { WebsocketsService } from "../websockets/websockets.service";
import { Entity } from "src/auth/types/entity.class";
import { wsEvents } from "src/websockets/wsEvents.enum";
import { MultilingualTextService } from "src/multilingual-text/multilingual-text.service";
import { MultilingualTextCategories } from "src/multilingual-text/types/multilingualTextCategories.enum";

@Injectable()
export class ClientsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly websocketsService: WebsocketsService,
        private readonly multilingualTextService: MultilingualTextService,
    ) {}
    private logger = new Logger(ClientsService.name);

    private maxClientsCounter = 999;
    private minClientsCounterToReset = 50; // if clients with number lower than this exist, counter cannot be reset
    private timeBetweenCounterResets = 1000 * 60 * 60 * 10; // in seconds - 8 hours

    async create(createClientDto: ClientCreateDto, entity: Entity): Promise<ClientResponseDto> {
        // Check if category exists
        const category = await this.databaseService.category.findUnique({ where: { id: createClientDto.categoryId } });
        if (!category) {
            this.logger.warn(
                `NotFoundException: Cannot create new client. Category with id ${createClientDto.categoryId} not found`,
            );
            throw new NotFoundException("Category not found");
        }

        // Prepare client number
        let counter = category.counter + 1;
        if (counter > this.maxClientsCounter) {
            this.logger.log(
                `Counter exceeded ${this.maxClientsCounter}. Resetting counter to 1 for category ${category.short_name}`,
            );
            counter = 1;
        }

        await this.databaseService.category.update({
            where: { id: createClientDto.categoryId },
            data: { counter: counter },
        });

        // Create client
        const dbClient = await this.databaseService.client.create({
            data: {
                number: counter,
                status: "Waiting",
                category: {
                    connect: {
                        id: createClientDto.categoryId,
                    },
                },
            },
            include: {
                category: true,
            },
        });

        const queueLength =
            (await this.databaseService.client.count({
                where: { status: "Waiting", category_id: createClientDto.categoryId },
            })) - 1;

        const client = await this.addCategoryNameFieldToClient({ queue_length: queueLength, ...dbClient });

        this.websocketsService.emit(wsEvents.ClientWaiting, client);
        this.logger.log(
            `[${entity.name}] Client created with number ${client.category.short_name}${client.number} and status 'Waiting'`,
        );
        this.resetCounterAfterTime(createClientDto.categoryId);
        return client;
    }

    async findAll(): Promise<ClientResponseDto[]> {
        const dbClients = await this.databaseService.client.findMany({
            orderBy: [{ creation_date: "asc" }],
            select: {
                id: true,
                number: true,
                category_id: true,
                category: { select: { id: true, short_name: true, multilingual_text_key: true } },
                status: true,
                seat: true,
                creation_date: true,
            },
        });

        //TODO not fetch every category translation for every client. Fetch first all categories and then map them
        const clients = dbClients.map(async (client) => await this.addCategoryNameFieldToClient(client));
        this.logger.debug(`Fetched ${dbClients.length} clients`);
        return Promise.all(clients);
    }

    /**
     * If any other client is in service by the same seat, it will be removed
     * @param id
     * @param updateClientDto
     * @returns
     */
    async update(id: number, updateClientDto: ClientUpdateDto, entity: Entity): Promise<ClientResponseDto> {
        // Check if client exists
        const isClient = await this.databaseService.client.findUnique({ where: { id: id } });
        if (!isClient) {
            this.logger.warn(`NotFoundException: Cannot update client with id ${id}. Client not found`);
            throw new NotFoundException("Client not found");
        }

        // Delete any other client in service from the same seat
        await this.databaseService.client.deleteMany({
            where: { status: "InService", seat: updateClientDto.seat },
        });

        // Update client
        const dbClient = await this.databaseService.client.update({
            where: { id: id },
            data: { status: updateClientDto.status, seat: updateClientDto.seat },
            include: {
                category: true,
            },
        });

        const client = await this.addCategoryNameFieldToClient(dbClient);

        this.websocketsService.emit(wsEvents.ClientInService, client);
        this.logger.log(
            `[${entity.name}] Client with id ${id}, category id ${dbClient.category_id} and number ${dbClient.category.short_name + dbClient.number} updated with status ${updateClientDto.status} and seat ${updateClientDto.seat}`,
        );
        return client;
    }

    async callAgain(id: number, entity: Entity): Promise<ClientResponseDto> {
        // Check if client exists
        const dbClient = await this.databaseService.client.findUnique({
            where: { id: id },
            include: { category: true },
        });
        if (!dbClient) {
            this.logger.warn(`NotFoundException: Client with id ${id} not found when calling again`);
            throw new NotFoundException("Client not found");
        }

        const client = await this.addCategoryNameFieldToClient(dbClient);

        this.websocketsService.emit(wsEvents.ClientCallAgain, client);
        this.logger.log(
            `[${entity.name}] Client with id ${id}, category id ${dbClient.category_id} and number ${dbClient.category.short_name + dbClient.number} called again`,
        );
        return client;
    }

    async remove(id: number, entity: Entity): Promise<ClientResponseDto> {
        // Check if client exists
        const isClient = await this.databaseService.client.findUnique({ where: { id: id } });
        if (!isClient) {
            this.logger.warn(`NotFoundException: Cannot delete client with number ${id}. Client not found.`);
            throw new NotFoundException("Client not found");
        }

        const dbClient = await this.databaseService.client.delete({ where: { id: id }, include: { category: true } });

        const client = await this.addCategoryNameFieldToClient(dbClient);

        this.websocketsService.emit(wsEvents.ClientRemoved, client);
        this.logger.log(
            `[${entity.name}] Client with id ${id}, category id ${dbClient.category_id} and number ${dbClient.category.short_name + dbClient.number}  deleted`,
        );
        return client;
    }

    async resetCounterAfterTime(categoryId: number) {
        const category = await this.databaseService.category.findUnique({ where: { id: categoryId } });
        if (!category) {
            this.logger.warn(
                `NotFoundException: Cannot reset counter for category with id ${categoryId}. Category not found`,
            );
            throw new NotFoundException("Category not found");
        }

        //check if it's time to reset the counter
        const now = new Date();
        const resetTime = new Date(now.getTime() - this.timeBetweenCounterResets);
        if (category.last_counter_reset > resetTime) {
            this.logger.debug(
                `Avoiding reset: Counter for category ${categoryId} was reset less than ${this.timeBetweenCounterResets / (1000 * 60 * 60)} hours ago`,
            );
            return;
        }

        //Delete clients older than resetTime
        const deletedClients = await this.databaseService.client.deleteMany({
            where: { creation_date: { lt: resetTime } },
        });
        this.logger.log(`Deleted ${deletedClients.count} clients older than ${resetTime} for category ${categoryId}`);

        //Check if there are clients with number lower than
        const clientsLowerThan = await this.databaseService.client.findMany({
            where: { category_id: categoryId, number: { lte: this.minClientsCounterToReset } },
        });

        if (clientsLowerThan.length > 0) {
            this.logger.log(
                `Cannot reset counter for category ${categoryId}. Clients with number lower than ${this.minClientsCounterToReset} exist`,
            );
            return;
        }

        // Reset counter
        await this.databaseService.category.update({
            where: { id: categoryId },
            data: { counter: 0, last_counter_reset: now },
        });

        this.logger.log(`Counter reset to 0 for category ${categoryId}`);
    }

    /**
     *
     * @param client It is client interface, but with modified category field
     * @returns Returns client with added translations for category name
     */
    async addCategoryNameFieldToClient(client: {
        id: number;
        number: number;
        category_id: number;
        status: "Waiting" | "InService";
        seat: number | null;
        creation_date: Date;
        queue_length?: number;
        category: { id: number; multilingual_text_key: string; short_name: string };
    }): Promise<ClientResponseDto> {
        const clientWithCategoryName = {
            ...client,
            category: {
                ...client.category,
                name: await this.multilingualTextService.getMultilingualText(
                    MultilingualTextCategories.categories,
                    client.category.multilingual_text_key,
                ),
            },
        };
        return clientWithCategoryName;
    }
}
