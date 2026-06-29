import { Module, forwardRef } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { DatabaseModule } from "src/database/database.module";
import { AuthModule } from "src/auth/auth.module";
import { UserSettingsModule } from "src/user-settings/user-settings.module";
import { SseModule } from "src/sse/sse.module";

@Module({
    imports: [DatabaseModule, forwardRef(() => AuthModule), forwardRef(() => UserSettingsModule), SseModule],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
