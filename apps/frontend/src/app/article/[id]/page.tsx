import { Article } from "@pc-builder/shared/article";
import { Roles } from "@pc-builder/shared/user";
import { notFound } from "next/navigation";
import React from "react";

import { ArticleComponent } from "@/features/article/components/Article";
import { verifyToken } from "@/features/auth/server";
import { getBackendUrl } from "@/utils/path";

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Retrieve user for admin preview authorization checks
  const user = await verifyToken();
  const isAdmin = user && (user.role === Roles.ADMIN || user.role === Roles.GUEST);

  const url = getBackendUrl(`/api/article/${id}${isAdmin ? "?preview=true" : ""}`);
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) return notFound();

  const data = (await response.json()) as Article;

  if (!data) {
    return notFound();
  }

  return (
    <div className="w-full min-h-screen py-4">
      <ArticleComponent article={data} />
    </div>
  );
}
