import { Module, forwardRef } from "@nestjs/common";
import { UserSettingsService } from "./user-settings.service";
import { UserSettingsController } from "./user-settings.controller";
import { DatabaseModule } from "../database/database.module";
import { AuthModule } from "src/auth/auth.module";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [DatabaseModule, forwardRef(() => AuthModule), forwardRef(() => UsersModule)],
    controllers: [UserSettingsController],
    providers: [UserSettingsService],
    exports: [UserSettingsService],
})
export class UserSettingsModule {}
