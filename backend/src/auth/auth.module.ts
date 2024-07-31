import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { JwtRefreshTokenStrategy } from "./strategies/jwtRefreshToken.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { DevicesModule } from '../devices/devices.module';

@Module({
    imports: [UsersModule, PassportModule, JwtModule, DevicesModule],
    providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
