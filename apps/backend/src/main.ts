import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import { doubleCsrf } from "csrf-csrf";
import { Request } from "express";
import { join } from "path";

import { AppModule } from "./app.module";
import { getAccessToken } from "./utils/auth/tokens";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(process.cwd(), "cdn"), {
    prefix: "/cdn/",
  });
  app.setGlobalPrefix("api");
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  });

  const { doubleCsrfProtection } = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET!,
    getSessionIdentifier: getAccessToken,
    skipCsrfProtection: (request: Request) =>
      request.originalUrl.startsWith("/api/auth") ||
      request.originalUrl.includes("/mapper/") ||
      request.originalUrl.includes("/bulk"),
    cookieName: "CSRF_Token",
    cookieOptions: {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      secure: true,
    },
    errorConfig: { message: "Invalid CSRF token." },
  });

  app.use(cookieParser(), doubleCsrfProtection);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
