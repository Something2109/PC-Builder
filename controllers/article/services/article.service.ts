import { Article } from "@/models/articles/article";
import { Products, Topics } from "@/utils/Enum";
import { ArticleSummary, ArticleType } from "@/utils/interface/article/article";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ArticleService {
  async getSummary(criteria: {
    topic: Topics;
    part?: Products;
  }): Promise<ArticleSummary[]> {
    const toType = (article: Article) => ({
      url: `/${article.topic}/${article.part}`,
      title: article.title,
      author: article.author,
      standfirst: article.standfirst,
      createdAt: article.createdAt,
    });

    const save = await Article.findAll({ where: criteria });

    return save.map((article) => toType(article));
  }

  async get(topic: string, part: Products): Promise<ArticleType | null> {
    const save = await Article.findOne({ where: { topic, part } });

    if (save) {
      return {
        type: "article",
        ...save.toJSON<Omit<ArticleType, "type">>(),
      };
    }

    return null;
  }

  async set(topic: string, part: Products, article: ArticleType) {
    if (Object.values(Products).includes(part)) {
      const { type, ...data } = article;

      let [save] = await Article.findOrBuild({ where: { topic, part } });
      save.set({ ...data });

      await save.save();

      return article;
    }
    return null;
  }
}
