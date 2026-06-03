import { EditableArticle } from "@/features/article/components/Form";
import { Article } from "@/utils/article";
import { AuthRole } from "@/features/auth";
import { Roles } from "@/utils/user";
import { notFound } from "next/navigation";

export default async function ArticleEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await fetch(`${process.env.BACKEND_HOST}/api/article/${id}`);

  if (!response.ok) return notFound();

  const data = (await response.json()) as Article;

  if (!data) {
    return notFound();
  }

  return (
    <AuthRole roles={[Roles.USER, Roles.ADMIN]}>
      <EditableArticle article={data as Article} />
    </AuthRole>
  );
}
