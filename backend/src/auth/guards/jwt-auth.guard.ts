import { ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthenticatedRequest } from "../types/authenticatedRequest.type";
import { jwtTokenExtractor } from "../strategies/jwt.strategy";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    private logger = new Logger(JwtAuthGuard.name);

    handleRequest<TUser>(err: unknown, user: TUser | false, info: unknown, context: ExecutionContext): TUser {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const { method, ip, url } = request;

        if (err || !user) {
            this.logger.warn(`${info} | ${method} ${url} ${ip}`, `Token: ${jwtTokenExtractor(request)}`);
            throw new UnauthorizedException(info);
        }
        return user;
    }
}
