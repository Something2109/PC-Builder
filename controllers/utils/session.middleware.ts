import { User } from "@/utils/interface/user/User";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class SessionExtractionMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(
    req: Request & { user?: User.JwtPayload; session?: string },
    _: Response,
    next: NextFunction
  ) {
    const [type, token] = req.cookies["Authorization"]?.split(" ") ?? [];
    if (type === "Bearer") {
      // Verify token.
      try {
        const payload = await this.jwtService.verifyAsync(token);
        req.user = payload.sub as User.JwtPayload;
        req.session = payload.type; // Save the session type (access or refresh) to the request object.
      } catch {}
    }

    next();
  }
}
