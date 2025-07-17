import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigModule } from "@nestjs/config";
import { LoggingInterceptor } from "./middleware/logging.interceptor";
import * as cookieParser from "cookie-parser";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    ConfigModule.forRoot();

    const app = await NestFactory.create(AppModule, {
        logger:
            process.env.NODE_ENV === "development"
                ? ["verbose", "debug", "log", "warn", "error"]
                : ["error", "warn", "log"],
    });
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.use(cookieParser());

    const corsOptions: CorsOptions = {
        origin: true,
        credentials: true,
    };

    app.enableCors(corsOptions);

    if (process.env.NODE_ENV === "development") {
        const config = new DocumentBuilder().setTitle("Queue Master API Documentation").setVersion("1.0").build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup("api", app, document);
    }

    await app.listen(process.env.PORT);
}
bootstrap();
