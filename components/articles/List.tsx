"use client";

import { ListType } from "@/models/articles/article";
import { RowWrapper } from "@/components/utils/FlexWrapper";
import { Button } from "@/components/utils/Button";
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

export function List({ content }: ContentProps<ListType>) {
  return (
    <ul>
      {content.content.map((inner, index) => (
        <li key={new Date().getTime() + index}>
          <ContentRenderer content={inner} prefix={content.symbol} />
        </li>
      ))}
    </ul>
  );
}

export function ListInput({
  content,
  updateSelf,
}: InputContentProps<ListType>) {
  const [count, setCount] = useState(content.content.length);

  return (
    <section className="flex flex-col gap-2 w-full border-2 rounded-xl p-3">
      <RowWrapper>
        <p>Symbol: </p>
        <InputArea
          placeholder="Symbol"
          className="font-bold"
          defaultValue={content.symbol}
          onChange={(e) => (content.symbol = e.target.value)}
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
          prefix={content.symbol}
          updateSelf={updateContent(content.content, inner, setCount)}
        />
      ))}
      <AddRow list={content.content} set={setCount} />
    </section>
  );
}
