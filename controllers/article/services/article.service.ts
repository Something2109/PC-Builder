import { ArticleModel } from "@/models/articles/article";
import { Products, Topics } from "@/utils/Enum";
import { Article } from "@/utils/interface/article/article";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ArticleService {
  async getSummary(criteria: {
    topic: Topics;
    part?: Products;
  }): Promise<Article.Summary[]> {
    const toType = (article: ArticleModel) => ({
      id: article.id,
      title: article.title,
      author: article.author,
      standfirst: article.standfirst,
      createdAt: article.createdAt,
    });

    const save = await ArticleModel.findAll({ where: criteria });

    return save.map((article) => toType(article));
  }

  async get(topic: string, part: Products): Promise<Article.Type | null> {
    const save = await ArticleModel.findOne({ where: { topic, part } });

    if (save) {
      return save.toJSON<Article.Type>();
    }

    return null;
  }

  async set(topic: string, part: Products, article: Article.Type) {
    if (Object.values(Products).includes(part)) {
      const { id, ...data } = article;

      let [save] = await ArticleModel.findOrBuild({ where: { topic, part } });
      save.set({ ...data });

      await save.save();

      return article;
    }
    return null;
  }
}
