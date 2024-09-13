import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigModule } from "@nestjs/config";
import { LoggingInterceptor } from "./middleware/logging.interceptor";
import * as cookieParser from 'cookie-parser';
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

async function bootstrap() {
    ConfigModule.forRoot();

    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.use(cookieParser());

    const corsOptions: CorsOptions = { 
        origin: process.env.FRONTEND_URL,
        credentials: true, 
      };

    app.enableCors(corsOptions);
    await app.listen(process.env.PORT);
}
bootstrap();
