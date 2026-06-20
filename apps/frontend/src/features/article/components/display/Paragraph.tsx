import { RowWrapper } from "@/ui/FlexWrapper";
import { Paragraph as ParagraphType } from "@pc-builder/shared/article";

import { ContentProps } from "../utils";

export function Paragraph({ content, prefix }: ContentProps<ParagraphType>) {
  const paragraph = (
    <p className="font-serif text-lg leading-relaxed text-slate-800 dark:text-slate-200 tracking-wide whitespace-pre-wrap">
      {content.content}
    </p>
  );
  return prefix ? (
    <RowWrapper className="gap-2 items-start py-0.5">
      <span className="font-serif text-lg text-blue-500 font-bold select-none min-w-[20px]">
        {prefix}
      </span>
      {paragraph}
    </RowWrapper>
  ) : (
    <div className="py-1">{paragraph}</div>
  );
}
