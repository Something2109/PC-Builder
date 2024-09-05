"use client";

import { Button } from "@/components/utils/Button";
import { ParagraphType } from "@/models/articles/article";
import { InputArea, ContentProps, RowWrapper, ColumnWrapper } from "./utils";

export function Paragraph({ children }: { children: string }) {
  return <p className="text-xl">{children}</p>;
}

export function ParagraphInput({
  content,
  prefix,
  updateSelf,
}: ContentProps<ParagraphType>) {
  return (
    <RowWrapper>
      {prefix ? <p>{prefix}</p> : undefined}
      <InputArea
        placeholder="Paragragh"
        className="text-xl"
        defaultValue={content.content}
        onChange={(e) => (content.content = e.target.value)}
      />
      <ColumnWrapper>
        <Button onClick={() => updateSelf.shiftUp()}>Up</Button>
        <Button onClick={() => updateSelf.remove()}>Remove</Button>
        <Button onClick={() => updateSelf.shiftDown()}>Down</Button>
      </ColumnWrapper>
    </RowWrapper>
  );
}
