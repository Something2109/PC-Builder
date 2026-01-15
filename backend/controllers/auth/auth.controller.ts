import {
  Body,
  Controller,
  Post,
  UseGuards,
  Res,
  HttpCode,
  UnauthorizedException,
  Req,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LoginAuthorizationGuard } from "./auth.guard";
import { AuthUser } from "controllers/utils/role/role.decorator";
import { ZodValidationPipe } from "controllers/utils/utils.modules";
import { LogInOptions, JwtPayload } from "@/utils/user";

const SignUpValidator = new ZodValidationPipe(LogInOptions);
const AUTHORIZATION_COOKIE_NAME = "Authorization";

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
    const tokens = await this.authService.signUp(
      payload.username,
      payload.password
    );

    const csrf_token = this.setToken(req, res, tokens.access_token);

    res.json(csrf_token ? { ...tokens, csrf_token } : tokens);
  }

  @UseGuards(new LoginAuthorizationGuard())
  @HttpCode(200)
  @Post("login")
  async logIn(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body(SignUpValidator) payload: LogInOptions
  ) {
    const tokens = await this.authService.logIn(
      payload.username,
      payload.password
    );

    const csrf_token = this.setToken(req, res, tokens.access_token);

    res.json(csrf_token ? { ...tokens, csrf_token } : tokens);
  }

  @HttpCode(200)
  @Post("refresh")
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @AuthUser() user?: JwtPayload
  ) {
    if (!user)
      throw new UnauthorizedException("You must log in to do this action!");

    const tokens = await this.authService.signTokens(user);

    const csrf_token = this.setToken(req, res, tokens.access_token);

    res.json(csrf_token ? { ...tokens, csrf_token } : tokens);
  }

  @HttpCode(200)
  @Post("logout")
  async logOut(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return { csrf_token: this.setToken(req, res) };
  }

  private setToken(req: Request, res: Response, token?: string) {
    token = token ? `Bearer ${token}` : "";
    const expires = new Date();
    expires.setDate(expires.getDate() + 2);

    const cookieOptions = {
      expires,
      sameSite: "strict",
      secure: true,
      httpOnly: true,
    } as const;

    req.cookies[AUTHORIZATION_COOKIE_NAME] = token;
    res.cookie(AUTHORIZATION_COOKIE_NAME, token, cookieOptions);

    return req.csrfToken && req.csrfToken({ cookieOptions });
  }
}
