import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards } from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { Roles } from "../auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("clients")
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}

    @Post()
    @Roles(["Device", "User", "Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    create(@Body(ValidationPipe) createClientDto: CreateClientDto) {
        return this.clientsService.create(createClientDto);
    }

    @Get()
    @Roles(["Device", "User", "Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    findAll() {
        return this.clientsService.findAll();
    }

    @Patch(":id")
    @Roles(["User", "Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    update(@Param("id") id: string, @Body(ValidationPipe) updateClientDto: UpdateClientDto) {
        return this.clientsService.update(id, updateClientDto);
    }

    @Post(":id/call-again")
    @Roles(["User", "Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    findOne(@Param("id") id: string) {
        return this.clientsService.callAgain(id);
    }

    @Delete(":id")
    @Roles(["User", "Admin"])
    @UseGuards(JwtAuthGuard, RolesGuard)
    remove(@Param("id") id: string) {
        return this.clientsService.remove(id);
    }
}
