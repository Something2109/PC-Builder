import React from "react";

import { EditableArticle } from "@/features/article/components/Form";
import { AuthRole } from "@/features/auth";
import { Article, ArticleStatus } from "@pc-builder/shared/article";
import { Roles } from "@pc-builder/shared/user";

export default async function NewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; part?: string }>;
}) {
  const { topic, part } = await searchParams;

  const defaultArticle: Article = {
    id: "",
    slug: "",
    title: "",
    author: "admin",
    standfirst: "",
    createdAt: new Date(),
    content: [],
    status: ArticleStatus.Draft,
    topic: topic || "",
    part: part || "",
    views: 0,
  };

  return (
    <AuthRole roles={[Roles.USER, Roles.ADMIN]}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 border-b pb-3">
          Create New Article
        </h1>
        <EditableArticle article={defaultArticle} isNew={true} />
      </div>
    </AuthRole>
  );
}
