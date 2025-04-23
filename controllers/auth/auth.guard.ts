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
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User.JwtPayload;

    if (user && !request.path.includes("logout"))
      throw new ForbiddenException(`You have logged in as ${user.username}`);

    return true;
  }
}
