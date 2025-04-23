import { ROLE_METADATA_KEY } from "controllers/utils/role/role.decorator";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "@/utils/Enum";
import { User } from "@/utils/interface/user/User";

/**
 * The global guard used by the application.
 * Read the jwt bearer from the request and authorize
 * based on the role saved in the bearer
 * and save the payload to the request object as "user" property.
 * Will only save the user payload if the context requires roles.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract the role required by the context (controller and handler function).
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(
      ROLE_METADATA_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredRoles) return true; // No role required.

    const request = context.switchToHttp().getRequest();
    const user = request.user as User.JwtPayload;

    if (!user)
      throw new UnauthorizedException("You must log in to do this action!");

    if (!requiredRoles.includes(user.role))
      throw new UnauthorizedException(
        "You are not authorized to do this action!"
      );

    return true;
  }
}
