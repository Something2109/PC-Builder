"use client";

import { Article, ArticleDto } from "@pc-builder/shared/article";
import React from "react";

import { useCreateArticle } from "@/features/article/hooks/useCreateArticle";

import { EditableArticle } from "./Form";

interface NewArticleClientProps {
  defaultArticle: Article;
}

export function NewArticleClient({ defaultArticle }: NewArticleClientProps) {
  const { createArticle, isCreating } = useCreateArticle();

  const handleSubmit = async (payload: ArticleDto) => {
    const queryParams = new URLSearchParams();
    if (payload.topic) queryParams.set("topic", payload.topic);
    if (payload.part) queryParams.set("part", payload.part);
    await createArticle({ payload, queryParams });
  };

  return (
    <EditableArticle
      article={defaultArticle}
      isNew={true}
      onSubmit={handleSubmit}
      isSaving={isCreating}
    />
  );
}
