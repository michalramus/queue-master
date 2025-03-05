import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { refreshTokenExtractor } from "../strategies/jwtRefreshToken.strategy";

@Injectable()
export class JwtRefreshTokenAuthGuard extends AuthGuard("jwtRefreshToken") {
    private logger = new Logger(JwtRefreshTokenAuthGuard.name);

    handleRequest(err, user, info, context) {
        const request = context.switchToHttp().getRequest();
        const { method, ip, url } = request;

        if (err || !user) {
            this.logger.warn(`${info} | ${method} ${url} ${ip}`, `Token: ${refreshTokenExtractor(request)}`);
            throw new UnauthorizedException(info);
        }
        return user;
    }
}
