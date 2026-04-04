"use client";

import * as Article from "@/utils/article";
import { RowWrapper } from "@/ui/FlexWrapper";
import { TextArea } from "@/ui/Input";

const ListInput = function ({
  content,
  children: [button, ...children],
}: {
  content: Article.List;
  children: React.ReactNode[];
}) {
  return (
    <section className="flex flex-col gap-2 w-full border-2 rounded-xl p-3">
      <RowWrapper>
        <p>Symbol: </p>
        <TextArea
          placeholder="Symbol"
          className="font-bold w-full"
          defaultValue={content.symbol}
          onChange={(e) => (content.symbol = e.target.value)}
        />
        {button}
      </RowWrapper>
      {children}
    </section>
  );
};

export default ListInput;
