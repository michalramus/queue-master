import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { Device } from "./types/device.interface";

@Injectable()
export class DevicesService {
    constructor(private readonly databaseService: DatabaseService) {}

    async findOne(deviceId: number): Promise<Device | null> {
        return this.databaseService.device.findUnique({
            where: { id: deviceId },
        });
    }

    /**
     * Newly created device gets privileges after accept
     * @param userAgent
     * @returns
     */
    async create(): Promise<Device | null> {
        return this.databaseService.device.create({ data: { accepted: true } });
    }
}
