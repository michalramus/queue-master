import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { Entity } from "src/auth/types/entity.class";
import { requireEnv } from "src/settings/appConfig.loader";

/** Payload signed by `Entity.getJwtPayload`, derived so both sides cannot drift apart */
export type JwtPayload = ReturnType<Entity["getJwtPayload"]>;

export function jwtTokenExtractor(req: Request): string | null {
    //check token in cookies and then in Authorization header
    let token: string | null = null;
    const authHeader = req.headers.authorization;

    if (req.cookies && typeof req.cookies["jwt"] === "string") {
        token = req.cookies["jwt"];
    } else if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
    }
    return token;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor() {
        super({
            jwtFromRequest: jwtTokenExtractor,
            ignoreExpiration: false,
            secretOrKey: requireEnv("JWT_SECRET_KEY"),
        });
    }

    async validate(payload: JwtPayload): Promise<Entity> {
        return new Entity(payload.sub, payload.type, payload.name);
    }
}
