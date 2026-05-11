import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ClientsModule } from "./clients/clients.module";
import { DatabaseModule } from "./database/database.module";
import { SseModule } from "./sse/sse.module";
import { CategoriesModule } from "./categories/categories.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { DevicesModule } from "./devices/devices.module";
import { GlobalSettingsModule } from "./global-settings/global-settings.module";
import { SettingsModule } from "./settings/settings.module";
import { UserSettingsModule } from "./user-settings/user-settings.module";
import { MultilingualTextModule } from "./multilingual-text/multilingual-text.module";
import { MultilingualSettingsModule } from "./multilingual-settings/multilingual-settings.module";
import { FileModule } from "./file/file.module";
import { OpeningHoursModule } from "./opening-hours/opening-hours.module";

@Module({
    imports: [
        ClientsModule,
        DatabaseModule,
        SseModule,
        CategoriesModule,
        //ServeStaticModule is disabled because it is not used in the project

        // ServeStaticModule.forRoot({
        //     rootPath: join(__dirname, "..", "static"),
        //     serveStaticOptions: {
        //         extensions: ["wav"],
        //         index: false,
        //         redirect: true,
        //     },
        // }),
        AuthModule,
        UsersModule,
        DevicesModule,
        GlobalSettingsModule,
        SettingsModule,
        UserSettingsModule,
        MultilingualTextModule,
        MultilingualSettingsModule,
        FileModule,
        OpeningHoursModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
