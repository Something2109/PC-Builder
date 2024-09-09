import {
  ArticleType,
  ContentType,
  ValidateArticle,
} from "@/models/articles/article";
import { Database } from "@/models/Database";
import { Products } from "@/models/interface";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { part: string } }
) {
  if (Object.values(Products).includes(params.part as Products)) {
    const article = await Database.articles.get(
      "introduction",
      params.part as Products
    );

    if (article) {
      return NextResponse.json(article);
    }
  }
  return NextResponse.json(
    {
      message: "Cannot find the article you need. Check if the path is correct",
    },
    {
      status: 404,
    }
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: { part: string } }
) {
  try {
    if (!Object.values(Products).includes(params.part as Products)) {
      throw new Error("The product link is incorrect");
    }

    const article = await request.json();

    if (!ValidateArticle.isArticle(article)) {
      throw new Error("Illegal article type");
    }

    const queue: ContentType[] = [...article.content];

    while (queue.length > 0) {
      const content = queue.shift()!;

      if (!ValidateArticle.isContent(content)) {
        throw new Error(
          `Illegal type of article content: ${JSON.stringify(content)}`
        );
      }

      if (content.type === "image") {
        if (content.image) {
          const link = Database.images.set(
            content.image,
            "articles",
            "introduction",
            params.part
          );
          content.src = link ?? "";
          content.image = undefined;
        }

        if (content.initial) {
          Database.images.remove(`public/${content.initial}`);
          delete content.initial;
        }
      }

      if (content.type === "section" || content.type === "list") {
        queue.push(...content.content);
      }
    }

    const result = await Database.articles.set(
      "introduction",
      params.part as Products,
      article
    );

    if (result) {
      return NextResponse.json(result);
    }
  } catch (err: any) {
    const error = err as Error;
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json(
    {
      message: "Error saving the article to the server",
    },
    {
      status: 500,
    }
  );
}
