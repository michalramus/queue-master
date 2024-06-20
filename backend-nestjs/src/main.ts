import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';

async function bootstrap() {
    ConfigModule.forRoot();

    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT);
}
bootstrap();
