import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { DatabaseService } from "src/database/database.service";
import { WebsocketsService } from "../websockets/websockets.service";

//Websockets events names
enum wsEvents {
    ClientWaiting = "ClientWaiting",
    ClientInService = "ClientInService",
}

@Injectable()
export class ClientsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly websocketsService: WebsocketsService,
    ) {}

    private maxClientsCounter = 999;

    async create(createClientDto: CreateClientDto) {
        // Check if category exists
        const category = await this.databaseService.category.findUnique({ where: { id: createClientDto.categoryId } });
        if (!category) {
            throw new NotFoundException("Category not found");
        }

        // Prepare client number
        let counter = category.counter + 1;
        if (counter > this.maxClientsCounter) {
            counter = 1;
        }

        await this.databaseService.category.update({
            where: { id: createClientDto.categoryId },
            data: { counter: counter },
        });

        //Create client
        const client = await this.databaseService.client.create({
            data: {
                number: category.id + counter,

                status: "Waiting",

                category: {
                    connect: {
                        id: createClientDto.categoryId,
                    },
                },
            },
        });

        this.websocketsService.emit(wsEvents.ClientWaiting, client);
        return client;
    }

    async findAll() {
        return this.databaseService.client.findMany({
            orderBy: [{ number: "asc" }],
            select: {
                number: true,
                categoryId: true,
                category: { select: { name: true } },
                status: true,
                seat: true,
                creationDate: true,
            },
        });
    }

    async update(id: string, updateClientDto: UpdateClientDto) {
        // Check if client exists
        const isClient = await this.databaseService.client.findUnique({ where: { number: id } });
        if (!isClient) {
            throw new NotFoundException("Client not found");
        }

        // Update client
        const client = await this.databaseService.client.update({
            where: { number: id },
            data: { status: updateClientDto.status, seat: updateClientDto.seat },
        });

        this.websocketsService.emit(wsEvents.ClientInService, client);
        return client;
    }

    async remove(id: string) {
        // Check if client exists
        const client = await this.databaseService.client.findUnique({ where: { number: id } });
        if (!client) {
            throw new NotFoundException("Client not found");
        }

        return this.databaseService.client.delete({ where: { number: id } });
    }
}
