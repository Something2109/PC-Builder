import { ROLE_METADATA_KEY } from "controllers/utils/role/role.decorator";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Roles } from "@/utils/Enum";

/**
 * The global guard used by the application.
 * Read the jwt bearer from the request and authorize
 * based on the role saved in the bearer
 * and save the payload to the request object as "user" property.
 * Will only save the user payload if the context requires roles.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract the role required by the context (controller and handler function).
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(
      ROLE_METADATA_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredRoles) return true; // No role required.

    const request = context.switchToHttp().getRequest();

    // Extract token.
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    if (type !== "Bearer")
      throw new UnauthorizedException("You must log in to do this action!");

    // Verify token.
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request["user"] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
