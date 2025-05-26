"use client";

import { Article } from "@/utils/interface/article/article";
import { RowWrapper } from "@/components/utils/FlexWrapper";
import { TextArea } from "@/components/utils/Input";
import { ContentProps } from "../utils";

const SectionInput = function ({
  content,
  prefix,
  children: [button, ...children],
}: ContentProps<Article.Section> & { children: React.ReactNode[] }) {
  return (
    <section className="flex flex-col gap-2 w-full border-2 rounded-xl p-3">
      <RowWrapper className="w-full">
        <h1 className="font-bold text-2xl">{prefix}</h1>
        <TextArea
          placeholder="Title"
          className="font-bold text-2xl w-full"
          defaultValue={content.title}
          onChange={(e) => (content.title = e.target.value)}
        />
        {button}
      </RowWrapper>
      {children}
    </section>
  );
};

export default SectionInput;
