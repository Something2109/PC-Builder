import { Tokens } from "@/utils/API";
import { JwtPayload } from "@/utils/user";
import { ConflictException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "controllers/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signUp(username: string, password: string) {
    const user = await this.userService.create({ username, password });

    if (!user)
      throw new ConflictException(`Username ${username} has been used`);

    return await this.logIn(username, password);
  }

  async logIn(username: string, password: string) {
    const user = await this.userService.verify({ username, password });

    return await this.signTokens(user);
  }

  async refresh(refresh_token: string) {
    const [_, token] = refresh_token.split(" ");

    try {
      const payload = await this.jwtService.verifyAsync(token);

      if (payload.type === Tokens.REFRESH) {
        return await this.signTokens(payload.sub);
      }
    } catch {}

    return null;
  }

  async signTokens(user: JwtPayload) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync({ sub: user, type: Tokens.ACCESS }),
      this.jwtService.signAsync(
        { sub: user, type: Tokens.REFRESH },
        { expiresIn: "30 days" }
      ),
    ]);

    return { access_token, refresh_token };
  }
}
