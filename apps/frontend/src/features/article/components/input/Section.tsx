"use client";

import { Section as SectionType } from "@pc-builder/shared/article";
import React from "react";

import { RowWrapper } from "@/ui/FlexWrapper";
import { AutoGrowingTextArea } from "@/ui/Input";

interface SectionInputProps {
  content: SectionType;
  prefix?: string;
  onChangeTitle: (val: string) => void;
}

export function SectionInput({ content, prefix, onChangeTitle }: SectionInputProps) {
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
    </div>
  );
}
