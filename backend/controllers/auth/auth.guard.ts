import { Tokens, Session } from "@/utils/API";
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
  constructor(private tokenType?: Tokens) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = request.session as Session | undefined;

    // If the session token type is the same as the guard's type.
    if (session?.type === this.tokenType) return true;

    // Treat refresh token as no login if no default token required.
    if (session?.type === Tokens.REFRESH && !this.tokenType) return true;

    // Default message for no login.
    let message = "You must log in to do this action!";

    // If the user is required to be not logged in.
    if (session && !this.tokenType) {
      message = `You have logged in as ${session.sub.username}`;
    }

    // If the user is required to use the refresh token.
    if (session && this.tokenType === Tokens.REFRESH) {
      message = "You must use the refresh token to do this action!";
    }

    throw new ForbiddenException(message);
  }
}
