import { Summary } from "@/utils/article";
import { Products } from "@/utils/part";
import { notFound } from "next/navigation";
import React from "react";
import { ColumnWrapper } from "@/ui/FlexWrapper";
import { ArticleLink } from "@/features/article";

export default async function PartTopicPage({
  params,
}: {
  params: Promise<{ topic: string; part: string }>;
}) {
  const query = new URLSearchParams(await params);
  if (!Object.values(Products).includes(query.get("part") as Products))
    return notFound();

  const response = await fetch(
    `${process.env.BACKEND_HOST}/api/article?${query}`,
  );

  if (!response.ok) return notFound();

  const articleSumaries = (await response.json()) as Summary[];

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
