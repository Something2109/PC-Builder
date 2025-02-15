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
import { Article } from "@/utils/interface/article/article";
import { Roles } from "@/utils/Enum";
import { QueryFilterPipe, ArticleFilter } from "./article.pipe";
import { ArticleService } from "./services/article.service";
import { ZodValidationPipe } from "controllers/utils/utils.modules";
import { Role } from "controllers/utils/role/role.decorator";

const ArticleValidator = new ZodValidationPipe(Article.Schema.partial());
const QueryValidator = new QueryFilterPipe();

@Controller("article")
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get()
  async listSummaries(@Query(QueryValidator) criteria: ArticleFilter) {
    const article = await this.articleService.list(criteria);

    return JSON.stringify(article);
  }

  @Post()
  async createArticle(
    @Body(ArticleValidator) article: Article.Type,
    @Query(QueryValidator) criteria: ArticleFilter
  ) {
    const result = await this.articleService.create(article, criteria);

    return JSON.stringify(result);
  }

  @Get(":id")
  async getArticle(@Param("id") id: string) {
    const result = await this.articleService.get(id);

    if (!result)
      throw new NotFoundException(`Cannot find article of id: ${id}`);

    return JSON.stringify(result);
  }

  @Role(Roles.ADMIN, Roles.GUEST)
  @Post(":id")
  async setArticle(
    @Param("id") id: string,
    @Body(ArticleValidator) article: Article.Type,
    @Query(QueryValidator) criteria: ArticleFilter
  ) {
    const result = await this.articleService.set(article, id, criteria);

    if (!result)
      throw new NotFoundException(`Cannot find article of id: ${id}`);

    return JSON.stringify(result);
  }

  @Role(Roles.ADMIN, Roles.GUEST)
  @Delete(":id")
  async deleteArticle(@Param("id") id: string) {
    const result = await this.articleService.delete(id);

    if (!result)
      throw new NotFoundException(`Cannot find article of id: ${id}`);

    return JSON.stringify(result);
  }
}
