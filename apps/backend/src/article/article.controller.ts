import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as API from "@pc-builder/shared/API";
import { CreateArticleDto, UpdateArticleDto } from "@pc-builder/shared/article";
import { Roles } from "@pc-builder/shared/user";
import { Role } from "src/utils/role/role.decorator";
import { ZodValidationPipe } from "src/utils/utils.modules";

import { QueryFilterPipe, ArticleFilter } from "./article.pipe";
import { ArticleService } from "./services/article.service";
import { ImageService } from "./services/image.service";

const CreateValidator = new ZodValidationPipe(CreateArticleDto);
const UpdateValidator = new ZodValidationPipe(UpdateArticleDto);
const QueryValidator = new QueryFilterPipe();

@Controller("article")
export class ArticleController {
  constructor(
    private articleService: ArticleService,
    private imageService: ImageService
  ) {}

  @Get()
  async listArticles(@Query(QueryValidator) criteria: ArticleFilter & API.PageOptions) {
    return this.articleService.list(criteria);
  }

  @Get(":idOrSlug")
  async getArticle(@Param("idOrSlug") idOrSlug: string, @Query("preview") preview?: string) {
    const result = await this.articleService.getByIdOrSlug(idOrSlug, preview === "true");

    if (!result) {
      throw new NotFoundException(`Cannot find article: ${idOrSlug}`);
    }
    return result;
  }

  @Role(Roles.ADMIN, Roles.GUEST)
  @Post()
  async createArticle(@Body(CreateValidator) dto: CreateArticleDto) {
    return this.articleService.create(dto);
  }

  // RESTful PUT endpoint
  @Role(Roles.ADMIN, Roles.GUEST)
  @Put(":id")
  async updateArticle(@Param("id") id: string, @Body(UpdateValidator) dto: UpdateArticleDto) {
    const result = await this.articleService.update(id, dto);

    if (!result) {
      throw new NotFoundException(`Cannot find article of id: ${id}`);
    }
    return result;
  }

  // Legacy POST endpoint for backward compatibility with frontend forms
  @Role(Roles.ADMIN, Roles.GUEST)
  @Post(":id")
  async legacyUpdateArticle(@Param("id") id: string, @Body(UpdateValidator) dto: UpdateArticleDto) {
    const result = await this.articleService.update(id, dto);

    if (!result) {
      throw new NotFoundException(`Cannot find article of id: ${id}`);
    }
    return result;
  }

  @Role(Roles.ADMIN, Roles.GUEST)
  @Delete(":id")
  async deleteArticle(@Param("id") id: string) {
    const result = await this.articleService.delete(id);

    if (!result) {
      throw new NotFoundException(`Cannot find article of id: ${id}`);
    }
    return result;
  }

  @Role(Roles.ADMIN, Roles.GUEST)
  @Post(":id/publish")
  async publishArticle(@Param("id") id: string) {
    const result = await this.articleService.publish(id);

    if (!result) {
      throw new NotFoundException(`Cannot find article of id: ${id}`);
    }
    return result;
  }

  @Role(Roles.ADMIN, Roles.GUEST)
  @Post("media/upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadMedia(@UploadedFile() file: any, @Query("subfolder") subfolder?: string) {
    if (!file) {
      throw new NotFoundException("No file provided");
    }

    // Save image using ImageService
    const base64Data = file.buffer.toString("base64");
    const mimeType = file.mimetype;
    const base64Str = `data:${mimeType};base64,${base64Data}`;

    const folders = subfolder ? subfolder.split("/") : ["uploads"];
    const savedPath = this.imageService.set(base64Str, ...folders);

    if (!savedPath) {
      throw new Error("Failed to save image file");
    }

    return { url: savedPath };
  }
}
