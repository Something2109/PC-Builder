import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Session } from "@pc-builder/shared/API";
import { JwtPayload } from "@pc-builder/shared/user";
import { Request, Response, NextFunction } from "express";

import { getAccessToken } from "./auth/tokens";

@Injectable()
export class SessionExtractionMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(
    req: Request & { session?: { type: string; sub: JwtPayload } },
    _: Response,
    next: NextFunction
  ) {
    const authString = getAccessToken(req);

    const [type, token] = authString?.split(" ") ?? [];
    if (type === "Bearer") {
      // Verify token.
      try {
        const payload = await this.jwtService.verifyAsync(token);
        req.session = payload as Session; // Save the session type (access or refresh) to the request object.
      } catch {}
    }

    next();
  }
}
