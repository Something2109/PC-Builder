"use client";

import * as Article from "@/utils/article";
import { RowWrapper } from "@/ui/FlexWrapper";
import { TextArea } from "@/ui/Input";
import { ContentProps } from "../utils";

const ParagraphInput = function ({
  content,
  prefix,
  children,
}: ContentProps<Article.Paragraph> & { children: React.ReactNode }) {
  return (
    <RowWrapper className="w-full">
      {prefix ? <p>{prefix}</p> : undefined}
      <TextArea
        placeholder="Paragragh"
        className="text-xl w-full"
        defaultValue={content.content}
        onChange={(e) => (content.content = e.target.value)}
      />
      {children}
    </RowWrapper>
  );
};

export default ParagraphInput;
