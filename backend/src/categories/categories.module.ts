import { Module } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";
import { DatabaseModule } from "src/database/database.module";
import { AuthModule } from "src/auth/auth.module";
import { MultilingualTextModule } from "src/multilingual-text/multilingual-text.module";
import { WebsocketsModule } from "src/websockets/websockets.module";

@Module({
    imports: [DatabaseModule, AuthModule, MultilingualTextModule, WebsocketsModule],
    controllers: [CategoriesController],
    providers: [CategoriesService],
})
export class CategoriesModule {}
