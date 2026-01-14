import { getAccessToken } from "./auth/tokens";
import { Session } from "@/utils/API";
import { JwtPayload } from "@/utils/user";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, NextFunction } from "express";

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
