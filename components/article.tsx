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
      <Paragraph>{article.standfirst}</Paragraph>
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
  switch (content.type) {
    case "paragraph":
      return <Paragraph>{content.content}</Paragraph>;
    case "image":
      return <Picture img={content} />;
    case "list":
      return <List section={content} />;
    case "section":
      return <Section section={content} prefix={prefix} />;
  }
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

function Paragraph({ children }: { children: string }) {
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

export { Article };
