import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "../roles.decorator";
import { AuthService } from "../auth.service";
import { Entity } from "../types/entity.class";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private authService: AuthService,
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | boolean {
        const roles = this.reflector.get(Roles, context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();

        return this.authService.validateRoles(roles, new Entity().convertFromReq(request))
       
    }
}
