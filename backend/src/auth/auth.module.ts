import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { JwtRefreshTokenStrategy } from "./strategies/jwtRefreshToken.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { DatabaseModule } from "src/database/database.module";

@Module({
    imports: [UsersModule, PassportModule, JwtModule, DatabaseModule],
    providers: [AuthService, JwtStrategy, JwtRefreshTokenStrategy],
    controllers: [AuthController],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
