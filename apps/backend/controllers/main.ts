import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { doubleCsrf } from "csrf-csrf";
import { Request } from "express";

import { AppModule } from "./app.module";
import { getAccessToken } from "./utils/auth/tokens";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  });

  const { doubleCsrfProtection } = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET!,
    getSessionIdentifier: getAccessToken,
    skipCsrfProtection: (request: Request) =>
      request.originalUrl.startsWith("/api/auth"),
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
