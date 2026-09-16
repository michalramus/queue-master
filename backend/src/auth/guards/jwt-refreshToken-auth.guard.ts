import { ExecutionContext, Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthenticatedRequest } from "../types/authenticatedRequest.type";
import { refreshTokenExtractor } from "../strategies/jwtRefreshToken.strategy";

@Injectable()
export class JwtRefreshTokenAuthGuard extends AuthGuard("jwtRefreshToken") {
    private logger = new Logger(JwtRefreshTokenAuthGuard.name);

    handleRequest<TUser>(err: unknown, user: TUser | false, info: unknown, context: ExecutionContext): TUser {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const { method, ip, url } = request;

        if (err || !user) {
            this.logger.warn(`${info} | ${method} ${url} ${ip}`, `Token: ${refreshTokenExtractor(request)}`);
            throw new UnauthorizedException(info);
        }
        return user;
    }
}
