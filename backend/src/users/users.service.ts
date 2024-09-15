import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService) {}

    async findOneById(userId: number) {
        return this.databaseService.user.findUnique({
            where: { userId: userId },
        });
    }

    async findOneByUsername(username: string) {
        return this.databaseService.user.findUnique({
            where: { username: username },
        });
    }
}
