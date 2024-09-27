"use client";

import { useState } from "react";
import { ArticleType } from "@/models/articles/article";
import { Paragraph } from "@/components/articles/Paragraph";
import { TextArea } from "@/components/utils/Input";
import {
  AddRow,
  ContentRenderer,
  InputRenderer,
  updateContent,
} from "@/components/articles/utils";

function Article({ article }: { article: ArticleType }) {
  let sectionCount = 1;
  return (
    <article className="flex flex-col gap-2 w-full">
      <h1 className="font-bold text-4xl my-5">{article.title}</h1>
      <Paragraph content={{ type: "paragraph", content: article.standfirst }} />
      {article.content.map((content, index) => (
        <ContentRenderer
          content={content}
          prefix={content.type === "section" ? `${sectionCount++}.` : undefined}
          key={`${index + 1}.${content.type}`}
        />
      ))}
    </article>
  );
}

function EditableArticle({ article }: { article: ArticleType }) {
  const [change, setChange] = useState(0);

  let sectionCount = 1;
  return (
    <article className="flex flex-col gap-2 w-full">
      <TextArea
        placeholder="Title"
        defaultValue={article.title}
        className="text-4xl font-bold my-5"
        onChange={(e) => (article.title = e.target.value)}
      />
      <TextArea
        placeholder="Standfirst"
        defaultValue={article.standfirst}
        className="text-xl"
        onChange={(e) => (article.standfirst = e.target.value)}
      />
      {article.content.map((content, index) => (
        <InputRenderer
          key={new Date().getTime() + index}
          content={content}
          prefix={content.type === "section" ? `${sectionCount++}.` : undefined}
          updateSelf={updateContent(article.content, content, setChange)}
        />
      ))}
      <AddRow list={article.content} set={setChange} />
    </article>
  );
}

export { Article, EditableArticle };
