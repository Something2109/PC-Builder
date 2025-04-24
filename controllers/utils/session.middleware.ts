import { API } from "@/utils/interface/api";
import { User } from "@/utils/interface/user/User";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class SessionExtractionMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(
    req: Request & { session?: { type: string; sub: User.JwtPayload } },
    _: Response,
    next: NextFunction
  ) {
    const authString = req.headers.authorization ?? req.cookies.Authorization;

    const [type, token] = authString?.split(" ") ?? [];
    if (type === "Bearer") {
      // Verify token.
      try {
        const payload = await this.jwtService.verifyAsync(token);
        req.session = payload as API.Session; // Save the session type (access or refresh) to the request object.
      } catch {}
    }

    next();
  }
}
