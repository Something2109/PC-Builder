import { ArticleLink } from "@/features/article";
import { ColumnWrapper } from "@/ui/FlexWrapper";
import * as Article from "@/utils/article";
import { notFound } from "next/navigation";
import React from "react";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const query = new URLSearchParams(await params);
  const response = await fetch(
    `${process.env.BACKEND_HOST}/api/article?${query}`
  );

  if (!response.ok) return notFound();

  const articleSumaries = (await response.json()) as Article.Summary[];

  return (
    <>
      <h1 className="text-4xl font-bold mb-2">Giới thiệu</h1>
      <ColumnWrapper>
        {articleSumaries.map((article) => (
          <ArticleLink
            key={article.id}
            href={`/article/${article.id}`}
            summary={article}
          />
        ))}
      </ColumnWrapper>
    </>
  );
}
