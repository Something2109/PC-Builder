import { Article } from "@/components/article";
import { RedirectButton } from "@/components/utils/Button";
import { ArticleType } from "@/utils/interface/article/article";
import { Products } from "@/utils/Enum";
import { notFound, redirect } from "next/navigation";
import React from "react";

export default async function PartTopicPage({
  params,
}: {
  params: { topic: string; part: string };
}) {
  if (Object.values(Products).includes(params.part as Products)) {
    const response = await fetch(
      `${process.env.BACKEND_HOST}/api/${params.topic}/${params.part}`
    );

    if (!response.ok) return notFound();

    const data = (await response.json()) as ArticleType;
    const editLink = `/${params.topic}/${params.part}/edit`;

    if (!data) {
      return redirect(editLink);
    }

    return (
      <>
        <Article article={data as ArticleType} />
        <RedirectButton href={editLink} className={"font-bold"}>
          Edit
        </RedirectButton>
      </>
    );
  }

  return notFound();
}
