import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { Entity } from "src/auth/types/entity.class";
import { JwtPayload } from "src/auth/strategies/jwt.strategy";
import { requireEnv } from "src/settings/appConfig.loader";

export function refreshTokenExtractor(req: Request): string | null {
    let token: string | null = null;
    if (req && req.cookies && typeof req.cookies["jwt_refresh"] === "string") {
        token = req.cookies["jwt_refresh"];
    }
    return token;
}

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, "jwtRefreshToken") {
    constructor() {
        super({
            jwtFromRequest: refreshTokenExtractor,
            ignoreExpiration: false,
            secretOrKey: requireEnv("JWT_REFRESH_TOKEN_KEY"),
        });
    }

    async validate(payload: JwtPayload): Promise<Entity> {
        return new Entity(payload.sub, payload.type, payload.name);
    }
}
