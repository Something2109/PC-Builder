import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Session, Tokens } from "@pc-builder/shared/API";
import { Roles } from "@pc-builder/shared/user";
import { ROLE_METADATA_KEY } from "src/utils/role/role.decorator";

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
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLE_METADATA_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true; // No role required.

    const request = context.switchToHttp().getRequest();
    const path = request.path.split("/")[1];
    const session = request.session as Session | undefined;

    // Check if no user login or the user is using refresh token to access other path except auth path.
    if (!session || (session.type !== Tokens.ACCESS && path !== "auth"))
      throw new UnauthorizedException("You must log in to do this action!");

    if (!requiredRoles.includes(session.sub.role))
      throw new ForbiddenException("You are not authorized to do this action!");

    return true;
  }
}
