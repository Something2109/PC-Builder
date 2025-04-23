import {
  Body,
  Controller,
  Post,
  UseGuards,
  Res,
  HttpCode,
} from "@nestjs/common";
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
    @Res({ passthrough: true }) res: Response,
    @Body(SignUpValidator) payload: User.LogInOptions
  ) {
    const tokens = await this.authService.signUp(
      payload.username,
      payload.password
    );

    this.setToken(res, tokens.access_token);

    res.json(tokens);
  }

  @HttpCode(200)
  @Post("login")
  async logIn(
    @Res({ passthrough: true }) res: Response,
    @Body(SignUpValidator) payload: User.LogInOptions
  ) {
    const tokens = await this.authService.logIn(
      payload.username,
      payload.password
    );

    this.setToken(res, tokens.access_token);

    res.json(tokens);
  }

  @HttpCode(200)
  @Post("logout")
  async logOut(@Res({ passthrough: true }) res: Response) {
    this.setToken(res);
  }

  private setToken(res: Response, token?: string) {
    const expired = new Date();
    expired.setDate(expired.getDate() + 2);

    res.cookie("Authorization", token ? `Bearer ${token}` : "", {
      expires: expired,
      sameSite: "strict",
      secure: true,
      httpOnly: true,
    });
  }
}
