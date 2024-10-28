import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

const cookieExtractor = function (req: any) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["jwt_refresh"];
    }
    return token;
};

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, "jwtRefreshToken") {
    constructor() {
        super({
            jwtFromRequest: cookieExtractor,
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_REFRESH_TOKEN_KEY,
        });
    }

    async validate(payload: any) {
        return { id: payload.sub, type: payload.type, name: payload.name };
    }
}
