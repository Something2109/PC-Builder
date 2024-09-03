"use client";

import React from "react";
import { ArticleType } from "@/models/articles/article";
import { Paragraph } from "@/components/articles/Paragraph";
import { ContentRenderer } from "@/components/articles/utils";

function Article({ article }: { article: ArticleType }) {
  let sectionCount = 1;
  return (
    <article className="flex flex-col gap-2 w-full">
      <h1 className="font-bold text-4xl my-5">{article.title}</h1>
      <Paragraph>{article.standfirst}</Paragraph>
      {article.content.map((content, index) => (
        <ContentRenderer
          content={content}
          prefix={`${
            content.type === "section" ? sectionCount++ : sectionCount
          }.`}
          key={`${index + 1}.${content.type}`}
        />
      ))}
    </article>
  );
}

export { Article };
