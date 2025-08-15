import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { User } from "./types/user.class";

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService) {}

    /**
     *
     * @param userId
     * @returns User with password hash
     */
    async findOneById(userId: number): Promise<User | null> {
        return this.databaseService.user.findUnique({
            where: { id: userId },
        });
    }

    /**
     *
     * @param username
     * @returns User with password hash
     */
    async findOneByUsername(username: string): Promise<User | null> {
        return this.databaseService.user.findUnique({
            where: { username: username },
        });
    }
}
