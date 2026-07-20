"use client";

import { Paragraph as ParagraphType } from "@pc-builder/shared/article";

import { AutoGrowingTextArea } from "@/ui/Input";

interface ParagraphInputProps {
  content: ParagraphType;
  prefix?: string;
  onChange: (val: string) => void;
}

export function ParagraphInput({ content, prefix, onChange }: ParagraphInputProps) {
  return (
    <div className="relative w-full flex items-start gap-2">
      {prefix && (
        <span className="font-serif text-lg text-blue-500 font-bold select-none min-w-5">
          {prefix}
        </span>
      )}
      <AutoGrowingTextArea
        placeholder="Type '/' for commands..."
        defaultValue={content.content}
        onChange={(e) => onChange(e.target.value)}
        className="font-serif text-lg leading-relaxed text-slate-800 dark:text-slate-200 tracking-wide"
      />
    </div>
  );
}
