import { NestFactory } from "@nestjs/core";
import { Request } from "express";
import cookieParser from "cookie-parser";
import { doubleCsrf } from "csrf-csrf";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");

  const { doubleCsrfProtection } = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET!,
    getSessionIdentifier: (request: Request) => request.cookies.Authorization,
    skipCsrfProtection: (request: Request) =>
      request.originalUrl.startsWith("/api/auth"),
    cookieName: "CSRF_Token",
  });

  app.use(cookieParser(), doubleCsrfProtection);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
