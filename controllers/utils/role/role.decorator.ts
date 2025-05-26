import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from "@nestjs/common";
import { User } from "@/utils/interface/user/User";
import { API } from "@/utils/interface/api";
import { Roles } from "@/utils/Enum";

/**
 * The key to extract the role metadata key in the reflector from the decorator.
 */
export const ROLE_METADATA_KEY = "roles";

/**
 * Role metadata decorator.
 * Map the role that can use the route or controller.
 */
export const Role = (...roles: Roles[]) =>
  SetMetadata(ROLE_METADATA_KEY, roles);

/**
 * User param decorator.
 * Return the user info in the jwt payload assossiated with the request.
 * The user info is read from the request object that is added in the role guard.
 * @param key The jwt user key to extract info from or undefined
 * @returns The whole jwt payload object if no key given, string of the given key
 * or undefined if no user info.
 */
export const AuthUser = createParamDecorator(
  (
    key: keyof User.JwtPayload | undefined,
    ctx: ExecutionContext
  ): (typeof key extends undefined ? User.JwtPayload : string) | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.session?.sub;

    if (!key || !user) return user;
    return user[key];
  }
);

export const AuthSession = createParamDecorator(
  (_: string | undefined, ctx: ExecutionContext): API.Tokens | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.session;
  }
);
