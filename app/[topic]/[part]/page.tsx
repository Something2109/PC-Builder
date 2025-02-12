import { ArticleComponent } from "@/components/article";
import { RedirectButton } from "@/components/utils/Button";
import { Article } from "@/utils/interface/article/article";
import { Products } from "@/utils/Enum";
import { notFound, redirect } from "next/navigation";
import React from "react";

export default async function PartTopicPage({
  params,
}: {
  params: Promise<{ topic: string; part: string }>;
}) {
  const { topic, part } = await params;
  if (Object.values(Products).includes(part as Products)) {
    const response = await fetch(
      `${process.env.BACKEND_HOST}/api/${topic}/${part}`
    );

    if (!response.ok) return notFound();

    const data = (await response.json()) as Article.Type;
    const editLink = `/${topic}/${part}/edit`;

    if (!data) {
      return redirect(editLink);
    }

    return (
      <>
        <ArticleComponent article={data as Article.Type} />
        <RedirectButton href={editLink} className={"font-bold"}>
          Edit
        </RedirectButton>
      </>
    );
  }

  return notFound();
}
