import { Injectable, Logger, NotFoundException, ConflictException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { User } from "./types/user.class";
import { UserCreateDto, UserUpdateDto, UserPasswordUpdateDto, UserResponseDto } from "./dto/user.dto";
import { Entity } from "../auth/types/entity.class";
import { MessageResponseDto } from "../dto/messageResponse.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(private readonly databaseService: DatabaseService) {}

    /**
     *
     * @param userId
     * @returns User with password hash
     */
    async findOneById(userId: number): Promise<User | null> {
        const user = await this.databaseService.user.findUnique({
            where: { id: userId },
        });
        return user;
    }

    /**
     *
     * @param username
     * @returns User with password hash
     */
    async findOneByUsername(username: string): Promise<User | null> {
        const user = await this.databaseService.user.findUnique({
            where: { username: username },
        });
        return user;
    }

    /**
     * Get all users (without password)
     * @returns List of users
     */
    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.databaseService.user.findMany({
            select: {
                id: true,
                username: true,
                role: true,
            },
            orderBy: { id: "asc" },
        });
        return users;
    }

    /**
     * Create a new user
     * @param userCreateDto - User creation data
     * @param entity - Entity from request for logging
     * @returns Created user (without password)
     */
    async create(userCreateDto: UserCreateDto, entity: Entity): Promise<UserResponseDto> {
        // Check if username already exists
        const existingUser = await this.findOneByUsername(userCreateDto.username);
        if (existingUser) {
            throw new ConflictException(`Username "${userCreateDto.username}" already exists`);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userCreateDto.password, 12);

        // Create user
        const user = await this.databaseService.user.create({
            data: {
                username: userCreateDto.username,
                password: hashedPassword,
                role: userCreateDto.role,
            },
            select: {
                id: true,
                username: true,
                role: true,
            },
        });

        this.logger.log(`[${entity.name}] Created user "${user.username}" with role "${user.role}"`);
        return user;
    }

    /**
     * Update user role and/or username
     * @param userId - ID of user to update
     * @param userUpdateDto - User update data
     * @param entity - Entity from request for logging
     * @returns Updated user (without password)
     */
    async updateUser(userId: number, userUpdateDto: UserUpdateDto, entity: Entity): Promise<UserResponseDto> {
        const user = await this.findOneById(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        // If username is being updated, check if it's already taken
        if (userUpdateDto.username && userUpdateDto.username !== user.username) {
            const existingUser = await this.findOneByUsername(userUpdateDto.username);
            if (existingUser) {
                throw new ConflictException(`Username "${userUpdateDto.username}" already exists`);
            }
        }

        // Prepare update data
        const updateData: any = {};
        if (userUpdateDto.role !== undefined) {
            updateData.role = userUpdateDto.role;
        }
        if (userUpdateDto.username !== undefined) {
            updateData.username = userUpdateDto.username;
        }

        const updatedUser = await this.databaseService.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                username: true,
                role: true,
            },
        });

        this.logger.log(`[${entity.name}] Updated user "${updatedUser.username}" (role: "${updatedUser.role}")`);
        return updatedUser;
    }

    /**
     * Update user password
     * @param userId - ID of user to update
     * @param userPasswordUpdateDto - Password update data
     * @param entity - Entity from request for logging
     * @returns Success message
     */
    async updatePassword(
        userId: number,
        userPasswordUpdateDto: UserPasswordUpdateDto,
        entity: Entity,
    ): Promise<MessageResponseDto> {
        const user = await this.findOneById(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(userPasswordUpdateDto.password, 12);

        await this.databaseService.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        this.logger.log(`[${entity.name}] Updated password for user "${user.username}"`);
        return { message: "Password updated successfully" };
    }

    /**
     * Delete a user
     * @param userId - ID of user to delete
     * @param entity - Entity from request for logging
     * @returns Deleted user (without password)
     */
    async remove(userId: number, entity: Entity): Promise<UserResponseDto> {
        const user = await this.findOneById(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const deletedUser = await this.databaseService.user.delete({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                role: true,
            },
        });

        this.logger.log(`[${entity.name}] Deleted user "${deletedUser.username}"`);
        return deletedUser;
    }
}
