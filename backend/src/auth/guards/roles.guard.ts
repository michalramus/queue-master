import { Injectable, CanActivate, ExecutionContext, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "../roles.decorator";
import { AuthService } from "../auth.service";
import { AuthenticatedRequest } from "../types/authenticatedRequest.type";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private authService: AuthService,
    ) {}

    private logger = new Logger(RolesGuard.name);

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

        const roles = this.reflector.get(Roles, context.getHandler());
        if (!roles) {
            return true;
        }

        return await this.authService.validateRoles(request, roles);
    }
}
