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
  UsePipes,
} from "@nestjs/common";
import { CookieOptions, Request, Response } from "express";
import { getAccessToken, getRefreshToken } from "src/utils/auth/tokens";
import { ZodValidationPipe } from "src/utils/utils.modules";

import { Session, Tokens } from "@/utils/API";
import { LogInOptions } from "@/utils/user";

import { LoginAuthorizationGuard } from "./auth.guard";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(new LoginAuthorizationGuard())
  @Post("signup")
  @UsePipes(new ZodValidationPipe(LogInOptions))
  async signUp(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() payload: LogInOptions
  ) {
    const { user, tokens } = await this.authService.signUp(payload.username, payload.password);

    this.setTokens(req, res, tokens);

    res.json(user);
  }

  @UseGuards(new LoginAuthorizationGuard())
  @HttpCode(200)
  @Post("login")
  @UsePipes(new ZodValidationPipe(LogInOptions))
  async logIn(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() payload: LogInOptions
  ) {
    const { user, tokens } = await this.authService.logIn(payload.username, payload.password);

    this.setTokens(req, res, tokens);

    res.json(user);
  }

  @Get("me")
  async getMe(@Req() req: Request & { session?: Session }) {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
      return { user: null };
    }

    const session = req.session;
    if (!session) {
      throw new UnauthorizedException("Invalid or expired session");
    }

    return { user: session.sub };
  }

  @HttpCode(200)
  @Post("refresh")
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refresh_token = getRefreshToken(req);

    if (!refresh_token) {
      throw new UnauthorizedException("No Refresh Token provided");
    }

    const { user, tokens } = await this.authService.refresh(refresh_token);

    this.setTokens(req, res, tokens);

    res.json(user);
  }

  @HttpCode(200)
  @Post("logout")
  async logOut(
    @Req() req: Request & { session?: Session },
    @Res({ passthrough: true }) res: Response
  ) {
    const user = req.session?.sub;
    if (user) {
      await this.authService.logOut(user.username);
    }

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
    access_token_expires.setMinutes(access_token_expires.getMinutes() + 30);
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
      sameSite: "lax",
      secure: true,
      httpOnly: true,
      ...options,
    } as const;

    req.cookies[name] = token;
    res.cookie(name, token, cookieOptions);
  }
}
