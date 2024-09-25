import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService) {}

    async findOneById(userId: number) {
        return this.databaseService.user.findUnique({
            where: { id: userId },
        });
    }

    async findOneByUsername(username: string) {
        return this.databaseService.user.findUnique({
            where: { username: username },
        });
    }
}
