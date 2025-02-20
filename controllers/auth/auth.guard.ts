import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

/**
 * Inspect if the user has logged in or not.
 * If haven't, give access to the authentication.
 */
@Injectable()
export class LoginAuthorizationGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Extract token.
    const [type, token] = request.cookies["Authorization"]?.split(" ") ?? [];
    if (type !== "Bearer") return true; // No token found.

    // Verify token.
    let username;
    try {
      const payload = await this.jwtService.verifyAsync(token);
      username = payload.username;

      if (request.path.includes("logout")) return true;
    } catch {
      return true;
    }

    // The user has valid token.
    throw new ForbiddenException(`You have logged in as ${username}`);
  }
}
