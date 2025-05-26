import { API } from "@/utils/interface/api";
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
  constructor(private loginToken?: API.Tokens) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = request.session as API.Session | undefined;

    // If the session is the same as the required state.
    if (session?.type === this.loginToken) return true;

    // Treat refresh token as no login.
    if (session?.type === API.Tokens.REFRESH && !this.loginToken) return true;

    // Default message for no login.
    let message = "You must log in to do this action!";

    // If the user is required for not logged in.
    if (session && !this.loginToken) {
      message = `You have logged in as ${session.sub.username}`;
    }

    // If the user is required to use the refresh token.
    if (session && this.loginToken === API.Tokens.REFRESH) {
      message = "You must use the refresh token to do this action!";
    }

    throw new ForbiddenException(message);
  }
}
