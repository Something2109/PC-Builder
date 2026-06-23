import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import * as User from "@pc-builder/shared/user";

/**
 * Inspect if the user is the correct user to access the user info api.
 * If the user is not logged in or not the correct user,
 * send exception.
 */
@Injectable()
export class UsernameAuthorizationGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const username = request.params.username;

    // No user info page accessed
    if (!username) return true;

    const authUser = request.user as User.JwtPayload | undefined;

    // Check username
    if (!authUser) throw new UnauthorizedException("You must login to do this function");

    if (authUser.username !== username)
      throw new UnauthorizedException(
        `Cannot access information of ${username} as ${authUser.username}`
      );

    return true;
  }
}
