import { Module } from "@nestjs/common";
import { MultilingualTextService } from "./multilingual-text.service";
import { DatabaseModule } from "src/database/database.module";

@Module({
    imports: [DatabaseModule],
    providers: [MultilingualTextService],
    exports: [MultilingualTextService],
})
export class MultilingualTextModule {}
