import {
    Controller,
    Get,
    Post,
    Delete,
    Patch,
    Param,
    Body,
    UseGuards,
    Request,
    ParseIntPipe,
    ValidationPipe,
} from "@nestjs/common";
import { DevicesService } from "./devices.service";
import { DeviceResponseDto, DevicePatchDto } from "./dto/device.dto";
import { Roles } from "../auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Entity } from "src/auth/types/entity.class";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
    // ApiBearerAuth,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
} from "@nestjs/swagger";
import { DeviceRegistrationResponseDto } from "src/auth/dto/auth.dto";

@ApiTags("devices")
@Controller("devices")
export class DevicesController {
    constructor(private readonly devicesService: DevicesService) {}

    @Post()
    @Roles(["Admin", "User"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Register a new device" })
    @ApiResponse({ status: 201, description: "Device created", type: DeviceRegistrationResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Insufficient permissions" })
    // @ApiBearerAuth("JWT-auth")
    async registerDevice(@Request() req): Promise<DeviceRegistrationResponseDto> {
        return this.devicesService.createDevice(Entity.convertFromReq(req));
    }

    @Get()
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Get list of all devices" })
    @ApiResponse({
        status: 200,
        description: "List of devices retrieved",
        type: [DeviceResponseDto],
    })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Insufficient permissions" })
    // @ApiBearerAuth("JWT-auth")
    async findAll(): Promise<DeviceResponseDto[]> {
        return this.devicesService.findAll();
    }

    @Patch(":id")
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Update device status (enable/disable)" })
    @ApiParam({ name: "id", description: "Device ID", type: "number" })
    @ApiBody({ type: DevicePatchDto })
    @ApiResponse({
        status: 200,
        description: "Device updated",
        type: DeviceResponseDto,
    })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Insufficient permissions" })
    // @ApiBearerAuth("JWT-auth")
    async updateDevice(
        @Param("id", ParseIntPipe) id: number,
        @Body(ValidationPipe) devicePatchDto: DevicePatchDto,
        @Request() req,
    ): Promise<DeviceResponseDto> {
        return this.devicesService.updateDevice(id, devicePatchDto, Entity.convertFromReq(req));
    }

    @Delete(":id")
    @Roles(["Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Delete a device" })
    @ApiParam({ name: "id", description: "Device ID", type: "number" })
    @ApiResponse({
        status: 200,
        description: "Device deleted",
        type: DeviceResponseDto,
    })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Insufficient permissions" })
    // @ApiBearerAuth("JWT-auth")
    async remove(@Param("id", ParseIntPipe) id: number, @Request() req): Promise<DeviceResponseDto> {
        return this.devicesService.remove(id, Entity.convertFromReq(req));
    }
}
