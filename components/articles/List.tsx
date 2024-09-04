"use client";

import { ListType } from "@/models/articles/article";
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
import { Button } from "@/components/utils/Button";

export function List({ section }: { section: ListType }) {
  return (
    <ul>
      {section.content.map((content, index) => (
        <li key={new Date().getTime() + index}>
          <ContentRenderer content={content} prefix={section.symbol} />
        </li>
      ))}
    </ul>
  );
}

export function ListInput({
  content,
  prefix,
  updateSelf,
}: ContentProps<ListType>) {
  const [count, setCount] = useState(content.content.length);

  return (
    <section className="flex flex-col gap-2 w-full border-2 rounded-xl p-3">
      <RowWrapper>
        <p>Symbol: </p>
        <InputArea
          rows={1}
          placeholder="Symbol"
          className="font-bold"
          defaultValue={content.symbol}
          onChange={(e) => {
            content.symbol = e.target.value;
            setCount((prev) => ++prev);
          }}
        />
        {content.content.length === 0 ? (
          <Button onClick={() => updateSelf.remove()}>Remove</Button>
        ) : undefined}
      </RowWrapper>
      {content.content.map((inner, index) => (
        <InputRenderer
          key={new Date().getTime() + index}
          content={inner}
          prefix={content.symbol}
          updateSelf={updateContent(content.content, inner, setCount)}
        />
      ))}
      <AddRow list={content.content} set={setCount} />
    </section>
  );
}
