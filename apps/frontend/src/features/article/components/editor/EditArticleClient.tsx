"use client";

import { Article, ArticleDto } from "@pc-builder/shared/article";
import React from "react";

import { useDeleteArticle } from "@/features/article/hooks/useDeleteArticle";
import { useUpdateArticle } from "@/features/article/hooks/useUpdateArticle";

import { EditableArticle } from "./EditableArticle";

interface EditArticleClientProps {
  article: Article;
}

export function EditArticleClient({ article }: EditArticleClientProps) {
  const { updateArticle, isUpdating } = useUpdateArticle();
  const { deleteArticle, isDeleting } = useDeleteArticle();

  const isSaving = isUpdating || isDeleting;

  const handleSubmit = async (payload: ArticleDto) => {
    await updateArticle({ id: article.id, payload });
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    await deleteArticle(article.id);
  };

  return (
    <EditableArticle
      article={article}
      isNew={false}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      isSaving={isSaving}
    />
  );
}
