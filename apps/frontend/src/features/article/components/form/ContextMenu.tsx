"use client";

import { ContentName } from "@pc-builder/shared/article";
import React from "react";

import { ContextMenuItem, ContextMenuSeparator } from "../../../../components/ui/ContextMenu";

interface BlockContextMenuProps {
  index: number;
  totalNodes: number;
  onInsertBelow: (type: ContentName) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onClose: () => void;
}

export function ArticleContextMenu({
  index,
  totalNodes,
  onInsertBelow,
  onDelete,
  onMoveUp,
  onMoveDown,
  onClose,
}: BlockContextMenuProps) {
  return (
    <>
      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider select-none">
        Add Part Below
      </div>
      <ContextMenuItem
        onClick={() => {
          onInsertBelow(ContentName.Paragraph);
          onClose();
        }}
      >
        <span>✏️</span> Paragraph
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => {
          onInsertBelow(ContentName.Section);
          onClose();
        }}
      >
        <span>Heading</span> Section Heading
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => {
          onInsertBelow(ContentName.List);
          onClose();
        }}
      >
        <span>•</span> Bullet List
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => {
          onInsertBelow(ContentName.Image);
          onClose();
        }}
      >
        <span>🖼️</span> Image Block
      </ContextMenuItem>
      <ContextMenuSeparator />
      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider select-none">
        Block Actions
      </div>
      <ContextMenuItem
        disabled={index === 0}
        onClick={() => {
          onMoveUp();
          onClose();
        }}
      >
        <span>↑</span> Move Up
      </ContextMenuItem>
      <ContextMenuItem
        disabled={index === totalNodes - 1}
        onClick={() => {
          onMoveDown();
          onClose();
        }}
      >
        <span>↓</span> Move Down
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 font-semibold"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        Delete Block
      </ContextMenuItem>
    </>
  );
}
