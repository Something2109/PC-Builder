import {
  Body,
  Controller,
  Post,
  UseGuards,
  Res,
  HttpCode,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginAuthorizationGuard } from "./auth.guard";
import { ZodValidationPipe } from "controllers/utils/utils.modules";
import { User } from "@/utils/interface/user/User";
import { API } from "@/utils/interface/api";
import { Response } from "express";
import { AuthUser } from "controllers/utils/role/role.decorator";

const SignUpValidator = new ZodValidationPipe(User.LogInOptions);

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(new LoginAuthorizationGuard())
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

  @UseGuards(new LoginAuthorizationGuard())
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
  @Post("refresh")
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @AuthUser() user?: User.JwtPayload
  ) {
    if (!user)
      throw new UnauthorizedException("You must log in to do this action!");

    const tokens = await this.authService.signTokens(user);

    this.setToken(res, tokens.access_token);

    res.json(tokens);
  }

  @UseGuards(new LoginAuthorizationGuard(API.Tokens.ACCESS))
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
