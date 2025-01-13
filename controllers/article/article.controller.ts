import { Products, Topics } from "@/utils/Enum";
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseEnumPipe,
  Post,
} from "@nestjs/common";
import {
  ContentType,
  ValidateArticle,
} from "@/utils/interface/article/article";
import { ArticleService } from "./services/article.service";
import { ImageService } from "./services/image.service";

@Controller("api")
export class ArticleController {
  constructor(
    private articleService: ArticleService,
    private imageService: ImageService
  ) {}

  @Get(":topic")
  async getTopic(@Param("topic", new ParseEnumPipe(Topics)) topic: Topics) {
    const article = await this.articleService.getSummary({ topic });

    return JSON.stringify(article);
  }

  @Get(":topic/:part")
  async getArticle(
    @Param("topic", new ParseEnumPipe(Topics)) topic: Topics,
    @Param("part", new ParseEnumPipe(Products)) part: Products
  ) {
    const article = await this.articleService.get(topic, part);

    if (article) {
      return JSON.stringify(article);
    }

    throw new NotFoundException(
      `Cannot find ${topic} article with the part: ${part}`
    );
  }

  @Post(":topic/:part")
  async setArticle(
    @Param("topic", new ParseEnumPipe(Topics)) topic: Topics,
    @Param("part", new ParseEnumPipe(Products)) part: Products,
    @Body() article: any
  ) {
    if (!ValidateArticle.isArticle(article)) {
      throw new BadRequestException("Illegal article type");
    }

    const queue: ContentType[] = [...article.content];

    while (queue.length > 0) {
      const content = queue.shift()!;

      if (!ValidateArticle.isContent(content)) {
        throw new BadRequestException(
          `Illegal type of article content: ${JSON.stringify(content)}`
        );
      }

      if (content.type === "image") {
        if (content.image) {
          const link = this.imageService.set(
            content.image,
            "articles",
            topic,
            part
          );
          content.src = link ?? "";
          content.image = undefined;
        }

        if (content.initial) {
          this.imageService.remove(`public/${content.initial}`);
          delete content.initial;
        }
      }

      if (content.type === "section" || content.type === "list") {
        queue.push(...content.content);
      }
    }

    const result = await this.articleService.set(topic, part, article);

    if (result) {
      return JSON.stringify(result);
    }

    throw new NotFoundException();
  }
}
