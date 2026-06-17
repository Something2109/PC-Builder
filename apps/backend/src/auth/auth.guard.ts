import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  Injectable,
} from "@nestjs/common";

import { Session } from "@/utils/API";

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

    // If the user is required to be logged in but isn't.
    if (this.requiredSession && !session) {
      throw new UnauthorizedException("You must log in to do this action!");
    }

    // If the user is required to be not logged in but is.
    if (!this.requiredSession && session) {
      throw new ForbiddenException(`You have logged in as ${session.sub.username}`);
    }

    return false;
  }
}
