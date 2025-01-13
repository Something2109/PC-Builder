import { Module } from "@nestjs/common";
import { ArticleController } from "./article.controller";
import { ArticleService } from "./services/article.service";
import { ImageService } from "./services/image.service";

@Module({
  controllers: [ArticleController],
  providers: [ArticleService, ImageService],
})
export class ArticleModule {}
