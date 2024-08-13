"use client";

import Image from "next/image";
import { useId } from "react";
import {
  ArticleType,
  SectionType,
  ImageType,
  ContentType,
  ListType,
} from "@/models/articles/article";
import React from "react";

function Article({ article }: { article: ArticleType }) {
  return (
    <article>
      <h1 className="font-bold text-4xl my-5">{article.title}</h1>
      {article.content.map((content, index) => (
        <ContentRenderer
          content={content}
          prefix={`${index + 1}.`}
          key={useId()}
        />
      ))}
    </article>
  );
}

function ContentRenderer({
  content,
  prefix,
}: {
  content: ContentType;
  prefix: string;
}) {
  if (typeof content === "string") {
    return <Paragraph>{content}</Paragraph>;
  }
  if ("src" in content && "caption" in content) {
    return <Picture img={content} />;
  }
  if ("symbol" in content && "content" in content) {
    return <List section={content} />;
  }
  if ("title" in content && "content" in content) {
    return <Section section={content} prefix={prefix} />;
  }
  console.log("Error in rendering content");
}

function Section({
  section,
  prefix,
}: {
  section: SectionType;
  prefix: string;
}) {
  return (
    <section className="my-4">
      <h1 className="font-bold text-2xl my-2">{`${prefix} ${section.title}`}</h1>
      {section.content.map((content, index) => (
        <ContentRenderer
          content={content}
          prefix={`${prefix}${index + 1}`}
          key={useId()}
        />
      ))}
    </section>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="text-xl my-2">{children}</p>;
}

function Picture({ img }: { img: ImageType }) {
  return (
    <picture className="*:mx-auto *:my-2 text-center">
      <Image src={img.src} width={800} height={450} alt={img.caption} />
      <p>{img.caption}</p>
    </picture>
  );
}

function List({ section }: { section: ListType }) {
  return (
    <ul>
      {section.content.map((content) => (
        <li key={useId()}>
          <ContentRenderer content={content} prefix={section.symbol} />
        </li>
      ))}
    </ul>
  );
}

function ArticleInput({
  path,
  article,
}: {
  path: string;
  article: ArticleType;
}) {
  return (
    <form
      method="POST"
      action={path}
      className="rounded-2xl border-2 p-2 flex flex-col"
    >
      <label htmlFor="title" className="hidden">
        Title
      </label>
      <textarea
        name="title"
        id="title"
        className="rounded-xl border-2 h-fit font-bold text-4xl break-words my-5 p-2"
      >
        {article.title}
      </textarea>
      {/* {article.content.map((content, index) => (
        <ContentRenderer
          content={content}
          prefix={`${index + 1}.`}
          key={useId()}
        />
      ))} */}
    </form>
  );
}

function ParagraphInput({ children }: { children: React.ReactNode }) {
  return (
    <>
      <label htmlFor="asd">Paragraph</label>
      <textarea id="asd" className="text-xl my-2">
        {children}
      </textarea>
    </>
  );
}

export default Article;
