import { ArticleComponent } from "@/components/article";
import { RedirectButton } from "@/components/utils/Button";
import { Article } from "@/utils/interface/article/article";
import { notFound } from "next/navigation";
import React from "react";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await fetch(`${process.env.BACKEND_HOST}/api/article/${id}`);

  if (!response.ok) return notFound();

  const data = (await response.json()) as Article.Type;

  if (!data) {
    return notFound();
  }

  return (
    <>
      <ArticleComponent article={data} />
      <RedirectButton href={`/article/${id}/edit`} className={"font-bold"}>
        Edit
      </RedirectButton>
    </>
  );
}
