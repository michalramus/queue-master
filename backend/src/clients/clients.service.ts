import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { DatabaseService } from "src/database/database.service";
import { WebsocketsService } from "../websockets/websockets.service";
import { Entity } from "src/auth/types/entity.class";
import { Client } from "./types/client.interface";

// Websockets events names
enum wsEvents {
    ClientWaiting = "ClientWaiting",
    ClientInService = "ClientInService",
    ClientRemoved = "ClientRemoved",
    ClientCallAgain = "ClientCallAgain",
}

@Injectable()
export class ClientsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly websocketsService: WebsocketsService,
    ) {}
    private logger = new Logger(ClientsService.name);

    private maxClientsCounter = 999;
    private timeBetweenCounterResets = 1000 * 60 * 60 * 24; // in seconds - 24 hours

    async create(createClientDto: CreateClientDto, entity: Entity): Promise<Client> {
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
                `Counter exceeded ${this.maxClientsCounter}. Resetting counter to 1 for category ${category.name}`,
            );
            counter = 1;
        }

        await this.databaseService.category.update({
            where: { id: createClientDto.categoryId },
            data: { counter: counter },
        });

        // Create client
        const client = await this.databaseService.client.create({
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

        this.websocketsService.emit(wsEvents.ClientWaiting, client);
        this.logger.log(`[${entity.name}] Client created with number ${client.number} and status 'Waiting'`);
        return client;
    }

    async findAll(): Promise<Client[]> {
        const clients = await this.databaseService.client.findMany({
            orderBy: [{ creation_date: "asc" }],
            select: {
                id: true,
                number: true,
                category_id: true,
                category: { select: { id: true, short_name: true, name: true } },
                status: true,
                seat: true,
                creation_date: true,
            },
        });
        this.logger.debug(`Fetched ${clients.length} clients`);
        return clients;
    }

    /**
     * If any other client is in service by the same seat, it will be removed
     * @param id
     * @param updateClientDto
     * @returns
     */
    async update(id: number, updateClientDto: UpdateClientDto, entity: Entity): Promise<Client> {
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
        const client = await this.databaseService.client.update({
            where: { id: id },
            data: { status: updateClientDto.status, seat: updateClientDto.seat },
            include: {
                category: true,
            },
        });

        this.websocketsService.emit(wsEvents.ClientInService, client);
        this.logger.log(
            `[${entity.name}] Client with id ${id}, category id ${client.category_id} and number ${client.category.name + client.number} updated with status ${updateClientDto.status} and seat ${updateClientDto.seat}`,
        );
        return client;
    }

    async callAgain(id: number, entity: Entity): Promise<Client> {
        // Check if client exists
        const client = await this.databaseService.client.findUnique({ where: { id: id }, include: { category: true } });
        if (!client) {
            this.logger.warn(`NotFoundException: Client with id ${id} not found when calling again`);
            throw new NotFoundException("Client not found");
        }

        this.websocketsService.emit(wsEvents.ClientCallAgain, client);
        this.logger.log(
            `[${entity.name}] Client with id ${id}, category id ${client.category_id} and number ${client.category.name + client.number} called again`,
        );
        return client;
    }

    async remove(id: number, entity: Entity): Promise<Client> {
        // Check if client exists
        const isClient = await this.databaseService.client.findUnique({ where: { id: id } });
        if (!isClient) {
            this.logger.warn(`NotFoundException: Cannot delete client with number ${id}. Client not found.`);
            throw new NotFoundException("Client not found");
        }

        const client = await this.databaseService.client.delete({ where: { id: id }, include: { category: true } });

        this.websocketsService.emit(wsEvents.ClientRemoved, client);
        this.logger.log(
            `[${entity.name}] Client with id ${id}, category id ${client.category_id} and number ${client.category.name + client.number}  deleted`,
        );
        return client;
    }
}
