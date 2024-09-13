import { Article } from "@/components/article";
import { RedirectButton } from "@/components/utils/Button";
import { ArticleType } from "@/models/articles/article";
import { Database } from "@/models/Database";
import { Products } from "@/utils/Enum";
import { notFound, redirect } from "next/navigation";

export default async function PartTopicPage({
  params,
}: {
  params: { topic: string; part: string };
}) {
  if (Object.values(Products).includes(params.part as Products)) {
    const data = await Database.articles.get(
      params.topic,
      params.part as Products
    );
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
