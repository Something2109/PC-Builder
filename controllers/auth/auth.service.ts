import { API } from "@/utils/interface/api";
import { User } from "@/utils/interface/user/User";
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

  async signTokens(user: User.JwtPayload) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync({ sub: user, type: API.Tokens.ACCESS }),
      this.jwtService.signAsync(
        { sub: user, type: API.Tokens.REFRESH },
        { expiresIn: "30 days" }
      ),
    ]);

    return { access_token, refresh_token };
  }
}
