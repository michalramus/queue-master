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
        const config = new DocumentBuilder()
            .setTitle("Queue Master API")
            .setDescription(
                `
API documentation for Queue Master - A queue management system

To authenticate, invoke the /auth/login endpoint to obtain a JWT token. 
Token is automatically saved in cookies, so you don't have to do anything more.
            `,
            )
            .setVersion("1.0")
            .addTag("auth", "Authentication endpoints - Start here to get your access token")
            .addTag("clients", "Client management endpoints - Manage queue clients")
            .addTag("categories", "Category management endpoints - Manage service categories")
            .addTag("devices", "Device management endpoints - Register, manage and control display devices")
            .addTag("users", "User management endpoints - Manage system users")
            .addTag("settings", "Settings management endpoints - Configure system settings")
            .addTag("file", "File management endpoints - Handle file uploads/downloads")
            //TODO
            // .addBearerAuth(
            //     {
            //         type: "http",
            //         scheme: "bearer",
            //         bearerFormat: "JWT",
            //         name: "JWT",
            //         description: "Enter JWT token obtained from /auth/login endpoint",
            //         in: "header",
            //     },
            //     "JWT-auth",
            // )
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup("api", app, document, {
            swaggerOptions: {
                tagsSorter: "alpha",
                operationsSorter: "alpha",
                docExpansion: "none",
                filter: true,
                showRequestHeaders: false,
            },
        });
    }

    await app.listen(process.env.PORT);
}
bootstrap();
