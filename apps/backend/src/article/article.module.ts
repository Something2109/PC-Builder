import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ArticleController } from "./article.controller";
import { ArticleSchema } from "./entities/Article.entity";
import { ArticleService } from "./services/article.service";
import { ImageService } from "./services/image.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: "article", schema: ArticleSchema }])],
  controllers: [ArticleController],
  providers: [ArticleService, ImageService],
})
export class ArticleModule {}
