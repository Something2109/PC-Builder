import {
  ArticleType,
  ContentType,
  ValidateArticle,
} from "@/models/articles/article";
import { Database } from "@/models/Database";
import { Products, Topics } from "@/models/interface";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { topic: string; part: string } }
) {
  try {
    if (!Object.values(Topics).includes(params.topic as Topics)) {
      throw new Error(
        `Cannot find the topic ${params.topic}. Check if the path is correct`
      );
    }

    if (!Object.values(Products).includes(params.part as Products)) {
      throw new Error(
        `Cannot find the topic ${params.part}. Check if the path is correct`
      );
    }

    const article = await Database.articles.get(
      params.topic as Topics,
      params.part as Products
    );

    if (article) {
      return NextResponse.json(article);
    }
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(
    {
      message: `Cannot find the article from /${params.topic}/${params.part}`,
    },
    {
      status: 404,
    }
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: { topic: string; part: string } }
) {
  try {
    if (!Object.values(Topics).includes(params.topic as Topics)) {
      throw new Error(
        `Cannot find the topic ${params.topic}. Check if the path is correct`
      );
    }

    if (!Object.values(Products).includes(params.part as Products)) {
      throw new Error(
        `Cannot find the topic ${params.part}. Check if the path is correct`
      );
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
            params.topic,
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
      params.topic as Topics,
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
