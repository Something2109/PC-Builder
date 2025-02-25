"use client";

import { Article } from "@/utils/interface/article/article";
import { RowWrapper } from "@/components/utils/FlexWrapper";
import { TextArea } from "@/components/utils/Input";
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
