import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ArticleController } from "./article.controller";
import { ArticleService } from "./services/article.service";
import { ImageService } from "./services/image.service";
import { ArticleSchema } from "./entities/Article.entity";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "article", schema: ArticleSchema }]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, ImageService],
})
export class ArticleModule {}
