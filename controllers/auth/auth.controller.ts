import { Body, Controller, Post, UseGuards, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginAuthorizationGuard } from "./auth.guard";
import { ZodValidationPipe } from "controllers/utils/utils.modules";
import { User } from "@/utils/interface/user/User";
import { Response } from "express";

const SignUpValidator = new ZodValidationPipe(User.LogInOptions);

@UseGuards(LoginAuthorizationGuard)
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  async signUp(
    @Res() res: Response,
    @Body(SignUpValidator) payload: User.LogInOptions
  ) {
    const access_token = await this.authService.signUp(
      payload.username,
      payload.password
    );

    this.setToken(res, access_token);

    return res;
  }

  @Post("login")
  async logIn(
    @Res() res: Response,
    @Body(SignUpValidator) payload: User.LogInOptions
  ) {
    const access_token = await this.authService.logIn(
      payload.username,
      payload.password
    );

    this.setToken(res, access_token);

    return res;
  }

  private setToken(res: Response, token: string) {
    const expired = new Date();
    expired.setDate(expired.getDate() + 2);

    res.setHeader(
      "Set-Cookie",
      `Authorization=Bearer ${token}; Path=/; Expires=${expired}; SameSite=Strict; Secure; HttpOnly`
    );

    res.json({ access_token: token });
  }
}
