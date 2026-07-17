import { Article, ArticleStatus } from "@pc-builder/shared/article";
import { Roles } from "@pc-builder/shared/user";
import React from "react";

import { NewArticleClient } from "@/features/article/components/NewArticleClient";
import { AuthRole } from "@/features/auth";

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
      <div className="w-full min-h-screen px-4 md:px-8 py-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 border-b pb-3">
          Create New Article
        </h1>
        <NewArticleClient defaultArticle={defaultArticle} />
      </div>
    </AuthRole>
  );
}
