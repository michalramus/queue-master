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

@Controller("clients")
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}

    @Post()
    @Roles(["Device", "User", "Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    create(@Body(ValidationPipe) createClientDto: CreateClientDto, @Request() req): Promise<Client> {
        return this.clientsService.create(createClientDto, Entity.convertFromReq(req));
    }

    @Get()
    @Roles(["Device", "User", "Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    findAll(): Promise<Client[]> {
        return this.clientsService.findAll();
    }

    @Patch(":id")
    @Roles(["User", "Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
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
    findOne(@Param("id", ParseIntPipe) id: number, @Request() req): Promise<Client> {
        return this.clientsService.callAgain(id, Entity.convertFromReq(req));
    }

    @Delete(":id")
    @Roles(["User", "Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    remove(@Param("id", ParseIntPipe) id: number, @Request() req): Promise<Client> {
        return this.clientsService.remove(id, Entity.convertFromReq(req));
    }
}
