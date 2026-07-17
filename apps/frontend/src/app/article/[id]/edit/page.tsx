import { getBackendUrl } from "@pc-builder/shared";
import { Article } from "@pc-builder/shared/article";
import { Roles } from "@pc-builder/shared/user";
import { notFound } from "next/navigation";
import React from "react";

import { EditArticleClient } from "@/features/article/components/EditArticleClient";
import { AuthRole } from "@/features/auth";

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
      <div className="w-full min-h-screen px-4 md:px-8 py-6">
        <EditArticleClient article={data as Article} />
      </div>
    </AuthRole>
  );
}
