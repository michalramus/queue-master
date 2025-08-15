import { Module } from "@nestjs/common";
import { DevicesService } from "./devices.service";
import { DevicesController } from "./devices.controller";
import { DatabaseModule } from "src/database/database.module";

import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [DatabaseModule, AuthModule],
    providers: [DevicesService],
    controllers: [DevicesController],
    exports: [DevicesService],
})
export class DevicesModule {}
