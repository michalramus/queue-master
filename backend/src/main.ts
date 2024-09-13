import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigModule } from "@nestjs/config";
import { LoggingInterceptor } from "./middleware/logging.interceptor";
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    ConfigModule.forRoot();

    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.use(cookieParser());
    app.enableCors();
    await app.listen(process.env.PORT);
}
bootstrap();
