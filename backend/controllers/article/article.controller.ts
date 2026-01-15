import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { Schema, type Type } from "@/utils/article";
import { Roles } from "@/utils/user";
import { QueryFilterPipe, ArticleFilter } from "./article.pipe";
import { ArticleService } from "./services/article.service";
import { ZodValidationPipe } from "controllers/utils/utils.modules";
import { Role } from "controllers/utils/role/role.decorator";

const ArticleValidator = new ZodValidationPipe(Schema.partial());
const QueryValidator = new QueryFilterPipe();

@Controller("article")
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get()
  async listSummaries(@Query(QueryValidator) criteria: ArticleFilter) {
    const article = await this.articleService.list(criteria);

    return article;
  }

  @Post()
  async createArticle(
    @Body(ArticleValidator) article: Type,
    @Query(QueryValidator) criteria: ArticleFilter
  ) {
    const result = await this.articleService.create(article, criteria);

    return result;
  }

  @Get(":id")
  async getArticle(@Param("id") id: string) {
    const result = await this.articleService.get(id);

    if (!result)
      throw new NotFoundException(`Cannot find article of id: ${id}`);

    return result;
  }

  @Role(Roles.ADMIN, Roles.GUEST)
  @Post(":id")
  async setArticle(
    @Param("id") id: string,
    @Body(ArticleValidator) article: Type,
    @Query(QueryValidator) criteria: ArticleFilter
  ) {
    const result = await this.articleService.set(article, id, criteria);

    if (!result)
      throw new NotFoundException(`Cannot find article of id: ${id}`);

    return result;
  }

  @Role(Roles.ADMIN, Roles.GUEST)
  @Delete(":id")
  async deleteArticle(@Param("id") id: string) {
    const result = await this.articleService.delete(id);

    if (!result)
      throw new NotFoundException(`Cannot find article of id: ${id}`);

    return result;
  }
}
