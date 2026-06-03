"use client";

import React from "react";
import { List as ListType, Content as ArticleContent, ContentName } from "@/utils/article";
import { RowWrapper } from "@/ui/FlexWrapper";
import { ContentListComponent } from "./ContentListComponent";

interface ListInputProps {
  content: ListType;
  onChangeSymbol: (val: string) => void;
  onUpdateContent: (val: ArticleContent[]) => void;
}

export function ListInput({
  content,
  onChangeSymbol,
  onUpdateContent,
}: ListInputProps) {
  return (
    <div className="flex flex-col gap-2 w-full border border-slate-100 dark:border-slate-800 rounded-xl p-3 my-2 bg-slate-50/20 dark:bg-slate-950/5">
      <RowWrapper className="items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-2">
        <span>List Type / Bullet Symbol:</span>
        <input
          type="text"
          maxLength={3}
          defaultValue={content.symbol}
          onChange={(e) => onChangeSymbol(e.target.value)}
          className="w-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-center font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
        />
      </RowWrapper>

      <div className="pl-4 border-l border-slate-100 dark:border-slate-800 space-y-2">
        <ContentListComponent
          parent={ContentName.List}
          contents={content.content}
          onUpdate={onUpdateContent}
          prefix={content.symbol}
        />
      </div>
    </div>
  );
}
