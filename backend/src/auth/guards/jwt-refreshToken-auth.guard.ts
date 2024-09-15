import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtRefreshTokenAuthGuard extends AuthGuard("jwtRefreshToken") {
    private logger = new Logger(JwtRefreshTokenAuthGuard.name);

    handleRequest(err, user, info, context) {
        const request = context.switchToHttp().getRequest();
        const { method, ip, url } = request;

        if (err || !user) {
            this.logger.warn(`${info} | ${method} ${url} ${ip}`, `Token: ${request.headers.authorization}`);
            throw new UnauthorizedException(info);
        }
        return user;
    }
}
