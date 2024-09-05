"use client";

import { Button } from "@/components/utils/Button";
import { SectionType } from "@/models/articles/article";
import {
  AddRow,
  ContentRenderer,
  InputArea,
  ContentProps,
  InputRenderer,
  RowWrapper,
  updateContent,
} from "./utils";
import { useState } from "react";

export function Section({
  section,
  prefix,
}: {
  section: SectionType;
  prefix: string;
}) {
  let sectionCount = 1;
  return (
    <section className="flex flex-col gap-1 w-full">
      <h1 className="font-bold text-2xl">{`${prefix} ${section.title}`}</h1>
      {section.content.map((content, index) => (
        <ContentRenderer
          content={content}
          prefix={`${prefix}${
            content.type === "section" ? sectionCount++ : undefined
          }.`}
          key={`${prefix}${index}.${content.type}`}
        />
      ))}
    </section>
  );
}

export function SectionInput({
  content,
  prefix,
  updateSelf,
}: ContentProps<SectionType>) {
  const [count, setCount] = useState(content.content.length);

  let sectionCount = 1;
  return (
    <section className="flex flex-col gap-2 w-full border-2 rounded-xl p-3">
      <RowWrapper>
        <h1 className="font-bold text-2xl">{prefix}</h1>
        <InputArea
          placeholder="Title"
          className="font-bold text-2xl"
          defaultValue={content.title}
          onChange={(e) => (content.title = e.target.value)}
        />
        {content.content.length === 0 ? (
          <Button onClick={() => updateSelf.remove()}>Remove</Button>
        ) : undefined}
      </RowWrapper>
      {content.content.map((inner, index) => (
        <InputRenderer
          key={new Date().getTime() + index}
          content={inner}
          prefix={
            inner.type === "section" ? `${prefix}${sectionCount++}.` : undefined
          }
          updateSelf={updateContent(content.content, inner, setCount)}
        />
      ))}
      <AddRow list={content.content} set={setCount} />
    </section>
  );
}
