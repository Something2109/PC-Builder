"use client";

import { Button } from "@/components/utils/Button";
import { SectionType } from "@/models/articles/article";
import { RowWrapper } from "@/components/utils/FlexWrapper";
import {
  AddRow,
  ContentProps,
  ContentRenderer,
  InputArea,
  InputContentProps,
  InputRenderer,
  updateContent,
} from "./utils";
import { useState } from "react";

export function Section({ content, prefix }: ContentProps<SectionType>) {
  let sectionCount = 1;
  return (
    <section className="flex flex-col gap-1 w-full">
      <h1 className="font-bold text-2xl">{`${prefix} ${content.title}`}</h1>
      {content.content.map((inner, index) => (
        <ContentRenderer
          content={inner}
          prefix={
            inner.type === "section" ? `${prefix}${sectionCount++}.` : undefined
          }
          key={`${prefix}${index}.${inner.type}`}
        />
      ))}
    </section>
  );
}

export function SectionInput({
  content,
  prefix,
  updateSelf,
}: InputContentProps<SectionType>) {
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
        <Button onClick={updateSelf.shiftUp}>Up</Button>
        {content.content.length === 0 ? (
          <Button onClick={updateSelf.remove}>Remove</Button>
        ) : undefined}
        <Button onClick={updateSelf.shiftDown}>Down</Button>
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
