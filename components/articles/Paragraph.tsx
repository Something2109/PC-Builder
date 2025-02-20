"use client";

import { Button } from "@/components/utils/Button";
import { Article } from "@/utils/interface/article/article";
import { RowWrapper, ColumnWrapper } from "@/components/utils/FlexWrapper";
import { TextArea } from "@/components/utils/Input";
import { ContentProps, InputContentProps } from "./utils";

export function Paragraph({
  content,
  prefix,
}: ContentProps<Article.Paragraph>) {
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
}: InputContentProps<Article.Paragraph>) {
  return (
    <RowWrapper>
      {prefix ? <p>{prefix}</p> : undefined}
      <TextArea
        placeholder="Paragragh"
        className="text-xl"
        defaultValue={content.content}
        onChange={(e) => (content.content = e.target.value)}
      />
      <ColumnWrapper className="justify-center">
        <Button onClick={() => updateSelf.shiftUp()}>Up</Button>
        <Button onClick={() => updateSelf.remove()}>Remove</Button>
        <Button onClick={() => updateSelf.shiftDown()}>Down</Button>
      </ColumnWrapper>
    </RowWrapper>
  );
}
