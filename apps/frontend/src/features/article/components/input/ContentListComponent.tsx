"use client";

import React from "react";
import { Content as ArticleContent, ContentName } from "@/utils/article";
import { EditorBlock } from "./EditorBlock";

const Content = ContentName;

const defaultValue: { [key in ContentName]: () => ArticleContent } = {
  [Content.Section]: () => ({ id: Math.random().toString(36).substring(2, 9), type: Content.Section, title: "", content: [] }),
  [Content.Paragraph]: () => ({ id: Math.random().toString(36).substring(2, 9), type: Content.Paragraph, content: "" }),
  [Content.Image]: () => ({ id: Math.random().toString(36).substring(2, 9), type: Content.Image, src: "", caption: "" }),
  [Content.List]: () => ({ id: Math.random().toString(36).substring(2, 9), type: Content.List, symbol: "•", content: [] }),
};

interface ContentListComponentProps {
  contents: ArticleContent[];
  prefix?: string;
  parent: ContentName;
  onUpdate: (updatedContents: ArticleContent[]) => void;
}

export function ContentListComponent({
  contents,
  prefix,
  parent,
  onUpdate,
}: ContentListComponentProps) {
  let sectionCount = 1;

  const handleUpdateBlock = (index: number, updatedBlock: ArticleContent) => {
    const nextContents = [...contents];
    nextContents[index] = updatedBlock;
    onUpdate(nextContents);
  };

  const handleInsertBlock = (index: number, type: ContentName) => {
    const nextContents = [...contents];
    nextContents.splice(index + 1, 0, defaultValue[type]());
    onUpdate(nextContents);
  };

  const handleDeleteBlock = (index: number) => {
    const nextContents = [...contents];
    nextContents.splice(index, 1);
    onUpdate(nextContents);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const nextContents = [...contents];
      [nextContents[index], nextContents[index - 1]] = [nextContents[index - 1], nextContents[index]];
      onUpdate(nextContents);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < contents.length - 1) {
      const nextContents = [...contents];
      [nextContents[index], nextContents[index + 1]] = [nextContents[index + 1], nextContents[index]];
      onUpdate(nextContents);
    }
  };

  const handleAppendBlock = (type: ContentName) => {
    onUpdate([...contents, defaultValue[type]()]);
  };

  return (
    <div className="space-y-1 w-full">
      {contents.map((content, index) => {
        let sectionPrefix = undefined;
        if (parent === Content.List) {
          sectionPrefix = prefix;
        } else if (content.type === Content.Section) {
          sectionPrefix = `${prefix ?? ""}${sectionCount++}.`;
        }

        return (
          <EditorBlock
            key={content.id || `${content.type}-${index}`}
            content={content}
            index={index}
            contents={contents}
            parent={parent}
            prefix={sectionPrefix}
            onUpdate={(updated) => handleUpdateBlock(index, updated)}
            onInsertBelow={(type) => handleInsertBlock(index, type)}
            onDelete={() => handleDeleteBlock(index)}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
          />
        );
      })}

      {/* Quick Add Inline Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2 pb-4 select-none">
        <button
          type="button"
          onClick={() => handleAppendBlock(Content.Paragraph)}
          className="flex items-center gap-1 py-1 px-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-900/50 dark:hover:bg-blue-950/20 text-xs text-slate-500 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors"
        >
          <span>✏️</span> Add Paragraph
        </button>
        <button
          type="button"
          onClick={() => handleAppendBlock(Content.Section)}
          className="flex items-center gap-1 py-1 px-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-900/50 dark:hover:bg-blue-950/20 text-xs text-slate-500 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors"
        >
          <span>Heading</span> Add Section
        </button>
        <button
          type="button"
          onClick={() => handleAppendBlock(Content.Image)}
          className="flex items-center gap-1 py-1 px-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-900/50 dark:hover:bg-blue-950/20 text-xs text-slate-500 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors"
        >
          <span>🖼️</span> Add Image
        </button>
        <button
          type="button"
          onClick={() => handleAppendBlock(Content.List)}
          className="flex items-center gap-1 py-1 px-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-900/50 dark:hover:bg-blue-950/20 text-xs text-slate-500 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors"
        >
          <span>•</span> Add List
        </button>
      </div>
    </div>
  );
}
