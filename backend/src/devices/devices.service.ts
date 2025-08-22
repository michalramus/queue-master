import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { DeviceResponseDto, DevicePatchDto } from "./dto/device.dto";
import { Entity } from "../auth/types/entity.class";
import { JwtService } from "@nestjs/jwt";
import { DeviceRegistrationResponseDto } from "../auth/dto/auth.dto";

@Injectable()
export class DevicesService {
    private readonly logger = new Logger(DevicesService.name);

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly jwtService: JwtService,
    ) {}

    async findOne(deviceId: number): Promise<DeviceResponseDto | null> {
        return this.databaseService.device.findUnique({
            where: { id: deviceId },
        });
    }

    async findAll(): Promise<DeviceResponseDto[]> {
        return this.databaseService.device.findMany({
            orderBy: { id: "asc" },
        });
    }

    /**
     * Register a new device and return JWT token
     * @param entity - Entity from request
     * @returns Device registration response with JWT token
     */
    async createDevice(entity: Entity): Promise<DeviceRegistrationResponseDto> {
        const device = await this.databaseService.device.create({ data: { accepted: true } });

        this.logger.log(`[${entity.name}] Registered new device ${JSON.stringify(device)}`);
        const payload = new Entity(device.id, "Device", `Device ${device.id}`).getJwtPayload();

        //Refresh token never expires
        const jwtToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET_KEY,
        });

        return { message: "Device registered successfully", jwt_token: jwtToken };
    }

    /**
     * Update device status (enable/disable)
     * @param deviceId - ID of device to update
     * @param devicePatchDto - DTO containing the updated device data
     * @param entity - Entity from request for logging
     * @returns Updated device
     */
    async updateDevice(deviceId: number, devicePatchDto: DevicePatchDto, entity: Entity): Promise<DeviceResponseDto> {
        const device = await this.findOne(deviceId);
        if (!device) {
            throw new NotFoundException(`Device with ID ${deviceId} not found`);
        }

        const updatedDevice = await this.databaseService.device.update({
            where: { id: deviceId },
            data: { accepted: devicePatchDto.accepted },
        });

        const action = devicePatchDto.accepted ? "Enabled" : "Disabled";
        this.logger.log(`[${entity.name}] ${action} device ${deviceId}`);
        return updatedDevice;
    }

    /**
     * Delete a device
     * @param deviceId - ID of device to delete
     * @param entity - Entity from request for logging
     * @returns Deleted device
     */
    async remove(deviceId: number, entity: Entity): Promise<DeviceResponseDto> {
        const device = await this.findOne(deviceId);
        if (!device) {
            throw new NotFoundException(`Device with ID ${deviceId} not found`);
        }

        const deletedDevice = await this.databaseService.device.delete({
            where: { id: deviceId },
        });

        this.logger.log(`[${entity.name}] Deleted device ${deviceId}`);
        return deletedDevice;
    }
}
