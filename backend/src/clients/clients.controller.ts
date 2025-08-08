import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ValidationPipe,
    UseGuards,
    Request,
    ParseIntPipe,
} from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { Roles } from "../auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Entity } from "src/auth/types/entity.class";
import { Client } from "./types/client.interface";
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

@ApiTags("clients")
@Controller("clients")
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}

    @Post()
    @Roles(["Device", "User", "Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Create a new client in queue" })
    @ApiBody({ type: CreateClientDto })
    @ApiResponse({ status: 201, description: "Client created successfully", type: "object" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden - insufficient permissions" })
    // @ApiBearerAuth("JWT-auth")
    create(@Body(ValidationPipe) createClientDto: CreateClientDto, @Request() req): Promise<Client> {
        return this.clientsService.create(createClientDto, Entity.convertFromReq(req));
    }

    @Get()
    @Roles(["Device", "User", "Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Get all clients in queue" })
    @ApiResponse({ status: 200, description: "List of all clients", type: Array })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden - insufficient permissions" })
    // @ApiBearerAuth("JWT-auth")
    findAll(): Promise<Client[]> {
        return this.clientsService.findAll();
    }

    @Patch(":id")
    @Roles(["User", "Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Update client information" })
    @ApiParam({ name: "id", description: "Client ID", type: "number" })
    @ApiBody({ type: UpdateClientDto })
    @ApiResponse({ status: 200, description: "Client updated successfully", type: "object" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden - insufficient permissions" })
    // @ApiBearerAuth("JWT-auth")
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body(ValidationPipe) updateClientDto: UpdateClientDto,
        @Request() req,
    ): Promise<Client> {
        return this.clientsService.update(id, updateClientDto, Entity.convertFromReq(req));
    }

    @Post(":id/call-again")
    @Roles(["User", "Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Call client again (re-queue)" })
    @ApiParam({ name: "id", description: "Client ID", type: "number" })
    @ApiResponse({ status: 200, description: "Client called again successfully", type: "object" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden - insufficient permissions" })
    // @ApiBearerAuth("JWT-auth")
    findOne(@Param("id", ParseIntPipe) id: number, @Request() req): Promise<Client> {
        return this.clientsService.callAgain(id, Entity.convertFromReq(req));
    }

    @Delete(":id")
    @Roles(["User", "Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Remove client from queue" })
    @ApiParam({ name: "id", description: "Client ID", type: "number" })
    @ApiResponse({ status: 200, description: "Client removed successfully", type: "object" })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiForbiddenResponse({ description: "Forbidden - insufficient permissions" })
    // @ApiBearerAuth("JWT-auth")
    remove(@Param("id", ParseIntPipe) id: number, @Request() req): Promise<Client> {
        return this.clientsService.remove(id, Entity.convertFromReq(req));
    }
}
