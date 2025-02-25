import { ArticleClass } from "../entities/Article.entity";
import { Products, Topics } from "@/utils/Enum";
import { Article } from "@/utils/interface/article/article";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel("article") private ArticleSchema: Model<ArticleClass>
  ) {}

  /**
   * List the articles that match the criteria.
   * @param criteria The criteria to filter.
   * @returns The list of article summaries.
   */
  async list(criteria: {
    topic?: Topics;
    part?: Products;
  }): Promise<Article.Summary[]> {
    const instances = await this.ArticleSchema.find(criteria).select({
      _id: 1,
      title: 1,
      author: 1,
      standfirst: 1,
      createdAt: 1,
    });

    return instances.map(this.toArticleType);
  }

  /**
   * Create the article with the following attributes.
   * @param article The article attribute object to create article.
   * @returns The new article object created or null if not successed.
   */
  async create(
    article: Article.Type,
    criteria?: { topic?: string; part?: string }
  ): Promise<Article.Type | null> {
    const instance = await this.ArticleSchema.insertOne({
      ...criteria,
      ...article,
    });

    if (!instance) return null;

    return this.toArticleType(instance);
  }

  /**
   * Get the article from the id.
   * @param id The id of the article to get.
   * @returns The article if found or null.
   */
  async get(id: string): Promise<Article.Type | null> {
    const instance = await this.ArticleSchema.findById(id);

    if (!instance) return null;

    return this.toArticleType(instance);
  }

  /**
   * Set the article of {@link id} with the article attributes.
   * @param article The article attribute object to change article.
   * @param id the id of the change article.
   * @returns The changed article or null if none found.
   */
  async set(
    article: Article.Type,
    id: string,
    criteria?: { topic?: string; part?: string }
  ): Promise<Article.Type | null> {
    const instance = await this.ArticleSchema.findById(id);

    if (!instance) return null;

    await instance.set({ ...criteria, ...article }).save();

    return this.toArticleType(instance);
  }

  /**
   * Delete the article with the {@link id} and return it.
   * @param id The article's id to delete.
   * @returns The article if success else null.
   */
  async delete(id: string): Promise<Article.Type | null> {
    const instance = await this.ArticleSchema.findById(id);

    if (!instance) return null;

    await instance.deleteOne();

    return this.toArticleType(instance);
  }

  /**
   * Transform the mongodb {@link ArticleClass} schema object
   * to the desirable {@link Article.Type} object.
   * @param instance The mongodb article class to transform.
   * @returns The corresponding article type object.
   */
  private toArticleType(
    instance: Document<unknown, {}, ArticleClass>
  ): Article.Type {
    const { _id, __v, ...obj } = instance.toJSON();

    return { id: _id, ...obj } as Article.Type;
  }
}
