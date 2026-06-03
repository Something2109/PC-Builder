import { ArticleLink } from "@/features/article";
import { ColumnWrapper } from "@/ui/FlexWrapper";
import { Summary } from "@/utils/article";
import { notFound } from "next/navigation";
import React from "react";

export default async function ArticleIndexPage() {
  const response = await fetch(`${process.env.BACKEND_HOST}/api/article`);

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
