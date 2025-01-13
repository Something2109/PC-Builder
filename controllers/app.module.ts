import { Module } from "@nestjs/common";
import { ArticleModule } from "./article/article.module";
import { PartModule } from "./part/part.module";
import { ConfigModule } from "@nestjs/config";
import { CrawlerModule } from "./crawler/crawler.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConnectionOptions } from "@/models/options";

@Module({
  imports: [
    PartModule,
    CrawlerModule,
    ArticleModule,
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: "mysql",
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadModels: true,
      ...ConnectionOptions,
    }),
  ],
})
export class AppModule {}
