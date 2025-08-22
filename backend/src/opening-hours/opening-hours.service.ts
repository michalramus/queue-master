import { Injectable, Logger } from "@nestjs/common";
import { DayOfWeek, Opening_Hours } from "@prisma/client";
import { DatabaseService } from "../database/database.service";
import { OpeningHoursDto, CreateOpeningHoursDto } from "./dto/opening-hours.dto";
import { WebsocketsService } from "../websockets/websockets.service";
import { Entity } from "../auth/types/entity.class";

@Injectable()
export class OpeningHoursService {
    private readonly logger = new Logger(OpeningHoursService.name);

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly websocketsService: WebsocketsService,
    ) {}

    async findAll(): Promise<Opening_Hours[]> {
        const openingHours = await this.databaseService.opening_Hours.findMany({
            orderBy: { day_of_week: "asc" },
        });

        // If no opening hours exist, create default ones (all days enabled, 9:00-17:00)
        if (openingHours.length === 0) {
            return this.createDefaultOpeningHours();
        }

        return openingHours;
    }

    async create(createDto: CreateOpeningHoursDto, entity: Entity): Promise<Opening_Hours[]> {
        for (const dayHours of createDto.opening_hours) {
            if (!dayHours.is_closed) {
                if (!dayHours.open_time || !dayHours.close_time) {
                    this.logger.warn(
                        `[${entity.name}] Missing times for ${dayHours.day_of_week} when not closed. Skipping.`,
                    );
                    continue;
                }
            }

            if (dayHours.open_time && dayHours.close_time) {
                if (!this.isValidTimeRange(dayHours.open_time, dayHours.close_time)) {
                    this.logger.warn(
                        `[${entity.name}] Invalid time range for ${dayHours.day_of_week}: ${dayHours.open_time} - ${dayHours.close_time}. Skipping.`,
                    );
                    continue;
                }
            }

            // Check if opening hours already exist for this day and override them
            const existing = await this.findByDayInternal(dayHours.day_of_week);

            if (existing) {
                // Override existing opening hours
                const updateData: any = {
                    is_closed: dayHours.is_closed,
                };

                // Only update times if not closing the day or if providing new times
                if (!dayHours.is_closed) {
                    updateData.open_time = dayHours.open_time;
                    updateData.close_time = dayHours.close_time;
                } else if (dayHours.open_time && dayHours.close_time) {
                    // If closing but providing times, preserve them
                    updateData.open_time = dayHours.open_time;
                    updateData.close_time = dayHours.close_time;
                }
                // If closing and no times provided, keep existing times

                await this.databaseService.opening_Hours.update({
                    where: { day_of_week: dayHours.day_of_week },
                    data: updateData,
                });
                this.logger.log(`[${entity.name}] Overriding existing opening hours for ${dayHours.day_of_week}`);
            } else {
                // Create new opening hours
                await this.databaseService.opening_Hours.create({
                    data: {
                        day_of_week: dayHours.day_of_week,
                        is_closed: dayHours.is_closed,
                        open_time: dayHours.open_time || "09:00",
                        close_time: dayHours.close_time || "17:00",
                    },
                });
                this.logger.log(`[${entity.name}] Creating new opening hours for ${dayHours.day_of_week}`);
            }
        }

        // Emit websocket event for real-time updates
        this.websocketsService.reloadFrontend();

        const results = await this.findAll();

        this.logger.log(`[${entity.name}] Successfully processed ${results.length} opening hours entries`);

        return results;
    }

    private async findByDayInternal(dayOfWeek: DayOfWeek): Promise<Opening_Hours | null> {
        return this.databaseService.opening_Hours.findUnique({
            where: { day_of_week: dayOfWeek },
        });
    }

    private isValidTimeRange(openTime: string, closeTime: string): boolean {
        return openTime < closeTime;
    }

    async isCurrentlyOpen(): Promise<boolean> {
        const now = new Date();
        const currentDay = this.getCurrentDayOfWeek(now);
        const currentTime = this.formatTime(now);

        const todayHours = await this.findByDayInternal(currentDay);

        if (!todayHours || todayHours.is_closed || !todayHours.open_time || !todayHours.close_time) {
            return false;
        }

        return currentTime >= todayHours.open_time && currentTime <= todayHours.close_time;
    }

    private async createDefaultOpeningHours(): Promise<Opening_Hours[]> {
        const defaultHours: OpeningHoursDto[] = [
            { day_of_week: DayOfWeek.MONDAY, is_closed: false, open_time: "09:00", close_time: "17:00" },
            { day_of_week: DayOfWeek.TUESDAY, is_closed: false, open_time: "09:00", close_time: "17:00" },
            { day_of_week: DayOfWeek.WEDNESDAY, is_closed: false, open_time: "09:00", close_time: "17:00" },
            { day_of_week: DayOfWeek.THURSDAY, is_closed: false, open_time: "09:00", close_time: "17:00" },
            { day_of_week: DayOfWeek.FRIDAY, is_closed: false, open_time: "09:00", close_time: "17:00" },
            { day_of_week: DayOfWeek.SATURDAY, is_closed: true, open_time: null, close_time: null },
            { day_of_week: DayOfWeek.SUNDAY, is_closed: true, open_time: null, close_time: null },
        ];

        const createdHours: Opening_Hours[] = [];
        for (const hours of defaultHours) {
            const created = await this.databaseService.opening_Hours.create({
                data: hours,
            });
            createdHours.push(created);
        }

        return createdHours;
    }

    private getCurrentDayOfWeek(date: Date): DayOfWeek {
        const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const dayMap = {
            0: DayOfWeek.SUNDAY,
            1: DayOfWeek.MONDAY,
            2: DayOfWeek.TUESDAY,
            3: DayOfWeek.WEDNESDAY,
            4: DayOfWeek.THURSDAY,
            5: DayOfWeek.FRIDAY,
            6: DayOfWeek.SATURDAY,
        };
        return dayMap[day];
    }

    private formatTime(date: Date): string {
        return date.toTimeString().slice(0, 5); // Format: "HH:mm"
    }
}
