import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    private logger = new Logger(JwtAuthGuard.name);

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
