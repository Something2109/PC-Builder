import { Module, Logger, MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { SequelizeModule } from "@nestjs/sequelize";
import { Connection } from "mongoose";

import { getConnectionOptions } from "@/models/sequelize.options";

import { AliasModule } from "./alias/alias.module";
import { AppController } from "./app.controller";
import { ArticleModule } from "./article/article.module";
import { AuthModule } from "./auth/auth.module";
import { BrandModule } from "./brand/brand.module";
import { BuildModule } from "./build/build.module";
import { CrawlerModule } from "./crawler/crawler.module";
import { MapperModule } from "./mapper/mapper.module";
import { PartModule } from "./part/part.module";
import { SeriesModule } from "./series/series.module";
import { UserModule } from "./user/user.module";
import { AuthGuard } from "./utils/role/role.guard";
import { SessionExtractionMiddleware } from "./utils/session.middleware";

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "30m" },
      }),
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...getConnectionOptions(),
        host:
          config.get<string>("MYSQL_HOST") ||
          config.get<string>("DATABASE_HOST") ||
          "localhost",
        port: Number(
          config.get("MYSQL_PORT") || config.get("DATABASE_PORT") || 3306
        ),
        username: config.get<string>("DATABASE_USERNAME") || "NestjsApp",
        password: config.get<string>("DATABASE_PASSWORD"),
        database: config.get<string>("DATABASE_NAME") || "PC_Builder",
        autoLoadModels: true,
        synchronize: true,
        sync: config.get<string>("DB_ALTER") === "true" ? { alter: true } : undefined,
        logging: (
          (logger: Logger) => (sql: string, timeout: any) =>
            setTimeout(() => logger.verbose(sql), timeout ?? 0)
        )(new Logger("Sequelize")),
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const username = config.get<string>("DATABASE_USERNAME");
        const password = config.get<string>("DATABASE_PASSWORD");
        const host = config.get<string>("MONGO_HOST") || "localhost:27017";
        const database = config.get<string>("DATABASE_NAME") || "PC_Builder";
        const auth = username && password ? `${username}:${password}@` : "";
        return {
          uri: `mongodb://${auth}${host}/${database}`,
          onConnectionCreate: (connection: Connection) => {
            const logger = new Logger("Mongodb");

            connection.on("connected", () =>
              logger.verbose("Mongodb database connected")
            );
            connection.on("open", () =>
              logger.verbose("Mongodb database open")
            );
            connection.on("disconnected", () =>
              logger.verbose("Mongodb database disconnected")
            );
            connection.on("reconnected", () =>
              logger.verbose("Mongodb database reconnected")
            );
            connection.on("disconnecting", () =>
              logger.verbose("Mongodb database disconnecting")
            );
          },
        };
      },
    }),
    ArticleModule,
    AuthModule,
    PartModule,
    BuildModule,
    UserModule,
    AliasModule,
    MapperModule,
    CrawlerModule,
    BrandModule,
    SeriesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionExtractionMiddleware).forRoutes("*path");
  }
}
