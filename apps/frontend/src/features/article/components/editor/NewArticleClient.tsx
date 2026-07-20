"use client";

import { Article, ArticleDto } from "@pc-builder/shared/article";
import React from "react";

import { useCreateArticle } from "@/features/article/hooks/useCreateArticle";

import { EditableArticle } from "./EditableArticle";

interface NewArticleClientProps {
  defaultArticle: Article;
}

export function NewArticleClient({ defaultArticle }: NewArticleClientProps) {
  const { createArticle, isCreating } = useCreateArticle();

  const handleSubmit = async (payload: ArticleDto) => {
    const queryParams = new URLSearchParams();
    if (payload.topic && payload.topic.length > 0) queryParams.set("topic", payload.topic[0]);
    if (payload.part && payload.part.length > 0) queryParams.set("part", payload.part[0]);
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
