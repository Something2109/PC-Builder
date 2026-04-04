import {
  Body,
  Controller,
  Post,
  UseGuards,
  Res,
  HttpCode,
  UnauthorizedException,
  Req,
  Get,
} from "@nestjs/common";
import { CookieOptions, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LoginAuthorizationGuard } from "./auth.guard";
import { getRefreshToken } from "controllers/utils/auth/tokens";
import { ZodValidationPipe } from "controllers/utils/utils.modules";
import { LogInOptions } from "@/utils/user";
import { Tokens } from "@/utils/API";

const SignUpValidator = new ZodValidationPipe(LogInOptions);

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(new LoginAuthorizationGuard())
  @Post("signup")
  async signUp(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body(SignUpValidator) payload: LogInOptions
  ) {
    const { user, tokens } = await this.authService.signUp(
      payload.username,
      payload.password
    );

    this.setTokens(req, res, tokens);

    res.json(user);
  }

  @UseGuards(new LoginAuthorizationGuard())
  @HttpCode(200)
  @Post("login")
  async logIn(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body(SignUpValidator) payload: LogInOptions
  ) {
    const { user, tokens } = await this.authService.logIn(
      payload.username,
      payload.password
    );

    this.setTokens(req, res, tokens);

    res.json(user);
  }

  @UseGuards(new LoginAuthorizationGuard(true))
  @Get("me")
  async getMe(@Req() req: Request) {
    return (req as any).session.sub;
  }

  @HttpCode(200)
  @Post("refresh")
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refresh_token = getRefreshToken(req);

    if (!refresh_token) {
      throw new UnauthorizedException("No Refresh Token provided");
    }

    const tokens = await this.authService.refresh(refresh_token);

    this.setTokens(req, res, tokens);

    res.json({ access_token: tokens.access_token });
  }

  @HttpCode(200)
  @Post("logout")
  async logOut(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    this.setTokens(req, res);

    res.json({});
  }

  private setTokens(
    req: Request,
    res: Response,
    tokens?: { access_token: string; refresh_token: string }
  ) {
    const { access_token, refresh_token } = tokens ?? {};

    const access_token_expires = new Date();
    access_token_expires.setDate(access_token_expires.getDate() + 1);
    this.setTokenCookie(req, res, Tokens.ACCESS, access_token, {
      expires: access_token_expires,
    });

    const refresh_token_expires = new Date();
    refresh_token_expires.setDate(refresh_token_expires.getDate() + 30);
    this.setTokenCookie(req, res, Tokens.REFRESH, refresh_token, {
      expires: refresh_token_expires,
      path: "/api/auth/refresh",
    });

    req.csrfToken && req.csrfToken();
  }

  private setTokenCookie(
    req: Request,
    res: Response,
    name: string,
    token?: string,
    options?: CookieOptions
  ) {
    token = token ? `Bearer ${token}` : "";

    const cookieOptions = {
      sameSite: "strict",
      secure: true,
      httpOnly: true,
      ...options,
    } as const;

    req.cookies[name] = token;
    res.cookie(name, token, cookieOptions);
  }
}
