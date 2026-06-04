"use client";

import React from "react";
import { Content as ArticleContent, ContentName } from "@/utils/article";
import { ParagraphInput } from "./Paragraph";
import { SectionInput } from "./Section";
import { ListInput } from "./List";
import { ImageInput } from "./Image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface EditorBlockProps {
  content: ArticleContent;
  index: number;
  contents: ArticleContent[];
  prefix?: string;
  parent: ContentName;
  onUpdate: (updatedBlock: ArticleContent) => void;
  onInsertBelow: (type: ContentName) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function EditorBlock({
  content,
  index,
  contents,
  prefix,
  onUpdate,
  onInsertBelow,
  onDelete,
  onMoveUp,
  onMoveDown,
}: EditorBlockProps) {
  const id = content.id || `${content.type}-${index}`;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : undefined,
  };

  const handleUpdateParagraph = (val: string) => {
    onUpdate({ ...content, type: ContentName.Paragraph, content: val });
  };

  const handleUpdateSectionTitle = (val: string) => {
    if (content.type === ContentName.Section) {
      onUpdate({ ...content, title: val });
    }
  };

  const handleUpdateSectionContent = (val: ArticleContent[]) => {
    if (content.type === ContentName.Section) {
      onUpdate({ ...content, content: val });
    }
  };

  const handleUpdateListSymbol = (val: string) => {
    if (content.type === ContentName.List) {
      onUpdate({ ...content, symbol: val });
    }
  };

  const handleUpdateListContent = (val: ArticleContent[]) => {
    if (content.type === ContentName.List) {
      onUpdate({ ...content, content: val });
    }
  };

  const handleUpdateImage = (val: { src: string; caption: string }) => {
    if (content.type === ContentName.Image) {
      onUpdate({ ...content, src: val.src, caption: val.caption });
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group/block flex items-start w-full gap-2 py-1.5 px-2 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 rounded-xl transition-all"
    >
      {/* Side Hover Handles (Move, Add, Delete) */}
      <div className="absolute -left-12 top-2 hidden group-hover/block:flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg shadow-sm p-1 z-10 select-none">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 dark:text-slate-600 cursor-grab active:cursor-grabbing touch-none"
          title="Drag to Reorder"
        >
          {/* Grabber/dots icon */}
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 disabled:opacity-30"
          title="Move Up"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === contents.length - 1}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 disabled:opacity-30"
          title="Move Down"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded text-red-500"
          title="Delete Block"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
        <div className="w-[1px] h-4 bg-slate-100 dark:bg-slate-800 mx-0.5" />
        <button
          type="button"
          onClick={() => onInsertBelow(ContentName.Paragraph)}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
          title="Add Block Below"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Specific Block Input Type Renderers */}
      <div className="w-full">
        {content.type === ContentName.Paragraph && (
          <ParagraphInput
            content={content}
            prefix={prefix}
            onChange={handleUpdateParagraph}
            onInsertBelow={onInsertBelow}
          />
        )}

        {content.type === ContentName.Section && (
          <SectionInput
            content={content}
            prefix={prefix}
            onChangeTitle={handleUpdateSectionTitle}
            onUpdateContent={handleUpdateSectionContent}
          />
        )}

        {content.type === ContentName.List && (
          <ListInput
            content={content}
            onChangeSymbol={handleUpdateListSymbol}
            onUpdateContent={handleUpdateListContent}
          />
        )}

        {content.type === ContentName.Image && (
          <ImageInput content={content} onChange={handleUpdateImage} />
        )}
      </div>
    </div>
  );
}
