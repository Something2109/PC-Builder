import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

import { Tokens } from "@pc-builder/shared/API";
import { JwtPayload } from "@pc-builder/shared/user";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signUp(username: string, password: string) {
    const user = await this.userService.create({ username, password });

    if (!user) throw new ConflictException(`Username ${username} has been used`);

    return await this.logIn(username, password);
  }

  async logIn(username: string, password: string) {
    const user = await this.userService.verify({ username, password });
    const tokens = await this.signTokens(user);

    await this.userService.setRefreshToken(user.username, tokens.refresh_token);

    return { user, tokens };
  }

  async refresh(refresh_token: string) {
    const [_, token] = refresh_token.split(" ");

    try {
      const payload = await this.jwtService.verifyAsync(token);

      if (payload.type === Tokens.REFRESH) {
        const isValid = await this.userService.verifyRefreshToken(payload.sub.username, token);

        if (!isValid) {
          // Token potentially stolen or reused after rotation.
          // Optional: Clear refresh token to force re-login.
          await this.userService.setRefreshToken(payload.sub.username, null);
          throw new UnauthorizedException("Invalid or Expired Refresh Token");
        }

        const tokens = await this.signTokens(payload.sub);
        await this.userService.setRefreshToken(payload.sub.username, tokens.refresh_token);

        return { user: payload.sub, tokens };
      } else {
        throw new UnauthorizedException("Invalid Token Type");
      }
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        throw new UnauthorizedException("Refresh Token Expired");
      }
      throw new UnauthorizedException("Invalid Refresh Token");
    }
  }

  async logOut(username: string) {
    await this.userService.setRefreshToken(username, null);
  }

  async signTokens(user: JwtPayload) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync({ sub: user, type: Tokens.ACCESS }),
      this.jwtService.signAsync({ sub: user, type: Tokens.REFRESH }, { expiresIn: "30 days" }),
    ]);

    return { access_token, refresh_token };
  }
}
