import { Module, Logger } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";
import { MongooseModule } from "@nestjs/mongoose";
import { ConnectionOptions } from "@/models/options";
import { Connection } from "mongoose";
import { ArticleModule } from "./article/article.module";
import { CrawlerModule } from "./crawler/crawler.module";
import { PartModule } from "./part/part.module";
import { UserModule } from "./user/user.module";
import { AuthGuard } from "./utils/role/role.guard";

// Initiate the JWT resolver module.
const Jwt = JwtModule.register({
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: "2 days" },
});

// Initiate the Sequelize module.
const Sequelize = SequelizeModule.forRoot({
  dialect: "mysql",
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  autoLoadModels: true,
  logging: (
    (logger: Logger) => (sql: string, timeout: any) =>
      setTimeout(() => logger.verbose(sql), timeout ?? 0)
  )(new Logger("Sequelize")),
  ...ConnectionOptions,
});

// Initiate the Mongoose module.
const Mongo = MongooseModule.forRoot(
  `mongodb://${process.env.MONGO_HOST}/${process.env.DATABASE_NAME}`,
  {
    onConnectionCreate: (connection: Connection) => {
      const logger = new Logger("Mongodb");

      connection.on("connected", () =>
        logger.verbose("Mongodb database connected")
      );
      connection.on("open", () => logger.verbose("Mongodb database open"));
      connection.on("disconnected", () =>
        logger.verbose("Mongodb database disconnected")
      );
      connection.on("reconnected", () =>
        logger.verbose("Mongodb database reconnected")
      );
      connection.on("disconnecting", () =>
        logger.verbose("Mongodb database disconnecting")
      );

      return connection;
    },
  }
);

@Module({
  imports: [
    ConfigModule.forRoot(),
    Jwt,
    Sequelize,
    Mongo,
    ArticleModule,
    CrawlerModule,
    PartModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
