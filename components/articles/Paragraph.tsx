"use client";

import { Button } from "@/components/utils/Button";
import { ParagraphType } from "@/models/articles/article";
import { RowWrapper, ColumnWrapper } from "@/components/utils/FlexWrapper";
import { ContentProps, InputArea, InputContentProps } from "./utils";

export function Paragraph({ content, prefix }: ContentProps<ParagraphType>) {
  const paragraph = <p className="text-xl">{content.content}</p>;
  return prefix ? (
    <RowWrapper>
      <p className="text-xl">{prefix}</p>
      {paragraph}
    </RowWrapper>
  ) : (
    paragraph
  );
}

export function ParagraphInput({
  content,
  prefix,
  updateSelf,
}: InputContentProps<ParagraphType>) {
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
