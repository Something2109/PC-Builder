import { User } from "@/utils/interface/user/User";
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";

/**
 * Inspect if the user has logged in or not.
 * If haven't, give access to the authentication.
 */
@Injectable()
export class LoginAuthorizationGuard implements CanActivate {
  constructor(private loginState?: string) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User.JwtPayload;
    const session = request.session as string | undefined;

    // If the session is the same as the required state.
    if (session === this.loginState) return true;

    // Treat refresh token as no login.
    if (session === "refresh" && !this.loginState) return true;

    // Default message for no login.
    let message = "You must log in to do this action!";

    // If the user is required for not logged in.
    if (session && !this.loginState) {
      message = `You have logged in as ${user.username}`;
    }

    // If the user is required to use the refresh token.
    if (session && this.loginState === "refresh") {
      message = "You must use the refresh token to do this action!";
    }

    throw new ForbiddenException(message);
  }
}
