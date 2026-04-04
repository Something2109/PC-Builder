import { Tokens } from "@/utils/API";
import { JwtPayload } from "@/utils/user";
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
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
    const tokens = await this.signTokens(user);

    return { user, tokens };
  }

  async refresh(refresh_token: string) {
    const [_, token] = refresh_token.split(" ");

    try {
      const payload = await this.jwtService.verifyAsync(token);

      if (payload.type === Tokens.REFRESH) {
        return await this.signTokens(payload.sub);
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
