import { User } from "@/utils/interface/user/User";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "controllers/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signUp(username: string, password: string): Promise<any> {
    const user = await this.userService.create({ username, password });

    if (!user) return null;

    return await this.logIn(username, password);
  }

  async logIn(username: string, password: string): Promise<any> {
    const payload = await this.userService.verify({ username, password });
    if (!payload) {
      throw new UnauthorizedException();
    }

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
