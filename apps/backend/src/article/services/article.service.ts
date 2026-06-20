import { Injectable, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";

import {
  Article,
  ArticleStatus,
  Summary,
  CreateArticleDto,
  UpdateArticleDto,
} from "@pc-builder/shared/article";
import { Products } from "@pc-builder/shared/part";

import { ArticleClass } from "../entities/Article.entity";

@Injectable()
export class ArticleService {
  constructor(@InjectModel("article") private articleModel: Model<ArticleClass>) {}

  /**
   * List the articles that match the criteria.
   * @param criteria The criteria to filter.
   * @returns The list of article summaries.
   */
  async list(criteria: {
    topic?: string;
    part?: Products;
    status?: ArticleStatus;
    page: number;
    limit: number;
    sort_key?: string;
    sort_order?: "asc" | "desc";
  }): Promise<Summary[]> {
    const { page, limit, sort_key, sort_order, ...filter } = criteria;
    const query: Record<string, unknown> = { ...filter };
    if (!query.status) {
      query.status = ArticleStatus.Published;
    }

    const sortConfig: Record<string, 1 | -1> = {};
    if (sort_key) {
      sortConfig[sort_key] = sort_order === "desc" ? -1 : 1;
    } else {
      sortConfig.publishedAt = -1;
      sortConfig.createdAt = -1;
    }

    const instances = await this.articleModel
      .find(query)
      .select({
        _id: 1,
        slug: 1,
        title: 1,
        author: 1,
        standfirst: 1,
        createdAt: 1,
        cover: 1,
        icon: 1,
        status: 1,
        topic: 1,
        part: 1,
        views: 1,
        publishedAt: 1,
      })
      .sort(sortConfig)
      .skip((page - 1) * limit)
      .limit(limit);

    return instances.map(this.toArticleType.bind(this));
  }

  /**
   * Get the article from the id or slug.
   * @param idOrSlug The id or slug of the article to get.
   * @param isPreview Whether previewing a draft is allowed.
   * @returns The article if found or null.
   */
  async getByIdOrSlug(idOrSlug: string, isPreview = false): Promise<Article | null> {
    const isId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
    const query = isId ? { _id: idOrSlug } : { slug: idOrSlug };

    const instance = await this.articleModel.findOne(query);
    if (!instance) return null;

    if (!isPreview && instance.status !== ArticleStatus.Published) {
      return null;
    }

    // Safely increment view count asynchronously if accessed as published article
    if (instance.status === ArticleStatus.Published) {
      this.articleModel
        .updateOne(query, { $inc: { views: 1 } })
        .exec()
        .catch((e) => console.error("Failed to increment views:", e));
    }

    return this.toArticleType(instance);
  }

  /**
   * Create the article with the following DTO.
   * @param dto The article creation DTO.
   * @returns The new article object.
   */
  async create(dto: CreateArticleDto): Promise<Article> {
    let slug = dto.slug;

    // Ensure slug uniqueness in the database
    let suffix = 1;
    const originalSlug = slug;
    while (await this.articleModel.findOne({ slug })) {
      slug = `${originalSlug}-${suffix++}`;
    }

    const instance = await this.articleModel.create({
      ...dto,
      slug,
      views: 0,
      status: dto.status || ArticleStatus.Draft,
      publishedAt: dto.status === ArticleStatus.Published ? new Date() : null,
    });

    return this.toArticleType(instance);
  }

  /**
   * Update the article of {@link id} with the DTO attributes.
   * @param id the id of the article to update.
   * @param dto The article update DTO.
   * @returns The updated article or null if none found.
   */
  async update(id: string, dto: UpdateArticleDto): Promise<Article | null> {
    const instance = await this.articleModel.findById(id);
    if (!instance) return null;

    const updates: Partial<ArticleClass> = { ...dto } as any;

    if (dto.slug && dto.slug !== instance.slug) {
      // Check duplicate slug for other records
      const duplicate = await this.articleModel.findOne({
        slug: dto.slug,
        _id: { $ne: id },
      });
      if (duplicate) {
        throw new ConflictException("Slug is already taken by another article");
      }
    }

    if (dto.status === ArticleStatus.Published && instance.status !== ArticleStatus.Published) {
      updates.publishedAt = new Date();
    }

    await instance.set(updates).save();
    return this.toArticleType(instance);
  }

  /**
   * Delete the article with the {@link id} and return it.
   * @param id The article's id to delete.
   * @returns The deleted article if success else null.
   */
  async delete(id: string): Promise<Article | null> {
    const instance = await this.articleModel.findById(id);
    if (!instance) return null;

    await instance.deleteOne();
    return this.toArticleType(instance);
  }

  /**
   * Publish the article.
   * @param id The article's id to publish.
   * @returns The published article.
   */
  async publish(id: string): Promise<Article | null> {
    const instance = await this.articleModel.findById(id);
    if (!instance) return null;

    instance.status = ArticleStatus.Published;
    instance.publishedAt = new Date();
    await instance.save();

    return this.toArticleType(instance);
  }

  /**
   * Transform the mongodb {@link ArticleClass} schema object
   * to the desirable {@link Article} object.
   * @param instance The mongodb article class to transform.
   * @returns The corresponding article type object.
   */
  private toArticleType(instance: Document<unknown, {}, ArticleClass>): Article {
    const json = instance.toJSON();
    const { _id, __v, ...obj } = json;

    return Article.parse({ id: _id.toString(), ...obj });
  }
}
