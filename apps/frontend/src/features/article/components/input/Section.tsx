"use client";

import React from "react";

import { RowWrapper } from "@/ui/FlexWrapper";
import { AutoGrowingTextArea } from "@/ui/Input";
import { Section as SectionType, Content as ArticleContent, ContentName } from "@pc-builder/shared/article";

import { ContentListComponent } from "./ContentListComponent";

interface SectionInputProps {
  content: SectionType;
  prefix?: string;
  onChangeTitle: (val: string) => void;
  onUpdateContent: (val: ArticleContent[]) => void;
}

export function SectionInput({
  content,
  prefix,
  onChangeTitle,
  onUpdateContent,
}: SectionInputProps) {
  return (
    <div className="flex flex-col gap-2 w-full mt-4">
      <RowWrapper className="w-full items-center gap-3">
        {prefix && (
          <span className="text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-lg select-none">
            {prefix}
          </span>
        )}
        <AutoGrowingTextArea
          placeholder="Heading Section title..."
          defaultValue={content.title}
          onChange={(e) => onChangeTitle(e.target.value)}
          className="font-sans text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight pb-1 border-b border-slate-100 dark:border-slate-800"
        />
      </RowWrapper>

      <div className="pl-4 md:pl-6 border-l border-slate-100 dark:border-slate-800 my-2 space-y-2">
        <ContentListComponent
          parent={ContentName.Section}
          contents={content.content}
          onUpdate={onUpdateContent}
          prefix={prefix}
        />
      </div>
    </div>
  );
}
