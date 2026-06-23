"use client";

import { Paragraph as ParagraphType, ContentName } from "@pc-builder/shared/article";
import { useState, KeyboardEvent } from "react";

import { AutoGrowingTextArea } from "@/ui/Input";

import { SlashMenu } from "./SlashMenu";

interface ParagraphInputProps {
  content: ParagraphType;
  prefix?: string;
  onChange: (val: string) => void;
  onInsertBelow: (type: ContentName) => void;
}

export function ParagraphInput({ content, prefix, onChange, onInsertBelow }: ParagraphInputProps) {
  const [showSlashMenu, setShowSlashMenu] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "/") {
      setShowSlashMenu(true);
    } else if (e.key === "Escape") {
      setShowSlashMenu(false);
    }
  };

  const handleSelectSlash = (type: ContentName) => {
    onInsertBelow(type);
    setShowSlashMenu(false);
  };

  return (
    <div className="relative w-full flex items-start gap-2">
      {prefix && (
        <span className="font-serif text-lg text-blue-500 font-bold select-none min-w-[20px]">
          {prefix}
        </span>
      )}
      <AutoGrowingTextArea
        placeholder="Type '/' for commands..."
        defaultValue={content.content}
        onKeyDown={handleKeyDown}
        onChange={(e) => onChange(e.target.value)}
        className="font-serif text-lg leading-relaxed text-slate-800 dark:text-slate-200 tracking-wide"
      />
      {showSlashMenu && (
        <SlashMenu onSelect={handleSelectSlash} onClose={() => setShowSlashMenu(false)} />
      )}
    </div>
  );
}
