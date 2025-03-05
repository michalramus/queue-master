import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { jwtTokenExtractor } from "../strategies/jwt.strategy";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    private logger = new Logger(JwtAuthGuard.name);

    handleRequest(err, user, info, context) {
        const request = context.switchToHttp().getRequest();
        const { method, ip, url } = request;

        if (err || !user) {
            this.logger.warn(`${info} | ${method} ${url} ${ip}`, `Token: ${jwtTokenExtractor(request)}`);
            throw new UnauthorizedException(info);
        }
        return user;
    }
}
