import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

export function jwtTokenExtractor(req: any) {
    //check token in cookies and then in Authorization header
    let token = null;
    const authHeader = req.headers.authorization;

    if (req.cookies && req.cookies["jwt"]) {
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
            secretOrKey: process.env.JWT_SECRET_KEY,
        });
    }

    async validate(payload: any) {
        return { id: payload.sub, type: payload.type, name: payload.name };
    }
}
