import { Article } from "@/components/article";
import { RedirectButton } from "@/components/utils/Button";
import { ArticleType } from "@/models/articles/article";
import { Database } from "@/models/Database";
import { Products } from "@/models/interface";
import { notFound, redirect } from "next/navigation";

export default function PartListPage({ params }: { params: { part: string } }) {
  if (Object.values(Products).includes(params.part as Products)) {
    const data = Database.articles.getIntroduction(params.part as Products);

    if (!data) {
      return redirect(`/introduction/${params.part}/edit`);
    }

    return (
      <>
        <Article article={data as ArticleType} />
        <RedirectButton
          href={`/introduction/${params.part}/edit`}
          className={"font-bold"}
        >
          Edit
        </RedirectButton>
      </>
    );
  }

  return notFound();
}
