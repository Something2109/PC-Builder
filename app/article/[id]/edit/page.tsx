import { EditableArticle } from "@/components/article";
import { Article } from "@/utils/interface/article/article";
import { AuthRole } from "@/components/auth";
import { Roles } from "@/utils/Enum";
import { notFound } from "next/navigation";

export default async function ArticleEditPage({
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
    <AuthRole roles={[Roles.USER, Roles.ADMIN]}>
      <EditableArticle article={data as Article.Type} />
    </AuthRole>
  );
}
