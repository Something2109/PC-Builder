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
  constructor(private requiredSession: boolean = false) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = request.session as Session | undefined;

    if (this.requiredSession && session) return true;

    if (!this.requiredSession && !session) return true;

    // Default message for no login.
    let message = "You must log in to do this action!";

    // If the user is required to be not logged in.
    if (session) {
      message = `You have logged in as ${session.sub.username}`;
    }

    throw new ForbiddenException(message);
  }
}
