"use client";

import React, { useEffect, useRef } from "react";

import { ContentName } from "@/utils/article";

interface SlashMenuProps {
  onSelect: (type: ContentName) => void;
  onClose: () => void;
}

export function SlashMenu({ onSelect, onClose }: SlashMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute top-8 left-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-20 w-48 space-y-1"
    >
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1 select-none">
        Insert Block
      </p>
      <button
        type="button"
        onClick={() => onSelect(ContentName.Paragraph)}
        className="w-full text-left px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2"
      >
        <span>✏️</span> Paragraph
      </button>
      <button
        type="button"
        onClick={() => onSelect(ContentName.Section)}
        className="w-full text-left px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2"
      >
        <span>📝</span> Section Header
      </button>
      <button
        type="button"
        onClick={() => onSelect(ContentName.Image)}
        className="w-full text-left px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2"
      >
        <span>🖼️</span> Image Block
      </button>
      <button
        type="button"
        onClick={() => onSelect(ContentName.List)}
        className="w-full text-left px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2"
      >
        <span>•</span> List Group
      </button>
    </div>
  );
}
