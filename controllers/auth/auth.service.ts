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

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync({ sub: user, type: "access" }),
      this.jwtService.signAsync(
        { sub: user, type: "refresh" },
        { expiresIn: "1m" }
      ),
    ]);

    return { access_token, refresh_token };
  }
}
