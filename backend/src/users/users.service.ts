import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService) {}

    async findOne(username: string) {
        return this.databaseService.user.findUnique({
            where: { username: username },
        });
    }
}
