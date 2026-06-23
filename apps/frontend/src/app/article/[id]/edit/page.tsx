import { Article } from "@pc-builder/shared/article";
import { Roles } from "@pc-builder/shared/user";
import { notFound } from "next/navigation";
import React from "react";

import { EditableArticle } from "@/features/article/components/Form";
import { AuthRole } from "@/features/auth";
import { getBackendUrl } from "@/utils/path";

export default async function ArticleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Retrieve with preview=true to load drafts
  const response = await fetch(getBackendUrl(`/api/article/${id}?preview=true`), {
    cache: "no-store",
  });

  if (!response.ok) return notFound();

  const data = (await response.json()) as Article;

  if (!data) {
    return notFound();
  }

  return (
    <AuthRole roles={[Roles.USER, Roles.ADMIN]}>
      <div className="container mx-auto px-4 py-8">
        <EditableArticle article={data as Article} />
      </div>
    </AuthRole>
  );
}
