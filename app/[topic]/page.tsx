import { ArticleLink } from "@/components/utils/ArticleLink";
import { ColumnWrapper } from "@/components/utils/FlexWrapper";
import { ArticleSummary } from "@/utils/interface/article/article";
import { notFound } from "next/navigation";
import React from "react";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const response = await fetch(`${process.env.BACKEND_HOST}/api/${topic}`);

  if (!response.ok) return notFound();

  const articleSumaries = (await response.json()) as ArticleSummary[];

  return (
    <>
      <h1 className="text-4xl font-bold mb-2">Giới thiệu</h1>
      <ColumnWrapper>
        {articleSumaries.map((article) => (
          <ArticleLink key={article.url} href={article.url} summary={article} />
        ))}
      </ColumnWrapper>
    </>
  );
}
