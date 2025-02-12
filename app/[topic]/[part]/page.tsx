import { Article } from "@/utils/interface/article/article";
import { Products, Topics } from "@/utils/Enum";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { ColumnWrapper } from "@/components/utils/FlexWrapper";
import { ArticleLink } from "@/components/utils/ArticleLink";

export default async function PartTopicPage({
  params,
}: {
  params: Promise<{ topic: Topics; part: string }>;
}) {
  const query = new URLSearchParams(await params);
  if (!Object.values(Products).includes(query.get("part") as Products))
    return notFound();

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
