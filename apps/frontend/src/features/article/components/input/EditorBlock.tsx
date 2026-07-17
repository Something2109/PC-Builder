"use client";

import type { GenericTreeStore, GenericFlattenItemTreeNode } from "../../../../utils/tree";
import type { ArticleTreeItemData } from "../../utils/articleTreeMapper";
import type { ItemInstance } from "@headless-tree/core";

import {
  Content as ArticleContent,
  ContentName,
  Paragraph,
  Section,
  List,
  Image,
} from "@pc-builder/shared/article";
import React from "react";

import { ContextMenuWrapper, ContextMenuItem, ContextMenuSeparator } from "./ContextMenu";
import { ImageInput } from "./Image";
import { ListInput } from "./List";
import { ParagraphInput } from "./Paragraph";
import { SectionInput } from "./Section";

interface EditorBlockProps {
  node: ItemInstance<GenericFlattenItemTreeNode<ArticleTreeItemData>>;
  store: GenericTreeStore<ArticleTreeItemData>;
  index: number;
  totalNodes: number;
  onInsertBelow: (type: ContentName) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function EditorBlock({
  node,
  store,
  index,
  totalNodes,
  onInsertBelow,
  onDelete,
  onMoveUp,
  onMoveDown,
}: EditorBlockProps) {
  const level = node.getItemMeta().level;
  const isDragging =
    node
      .getTree()
      .getState()
      .dnd?.draggedItems?.some((dragItem) => dragItem.getId() === node.getId()) || false;
  const isTargetAbove = node.isDragTargetAbove?.() || false;
  const isTargetBelow = node.isDragTargetBelow?.() || false;
  const isOver = node.isDraggingOver?.() || false;

  const itemData = node.getItemData();
  const item = itemData.item!;

  const handleUpdateParagraph = (val: string) => {
    store.setNodeItem(node.getId(), {
      type: ContentName.Paragraph,
      content: val,
    });
  };

  const handleUpdateSectionTitle = (val: string) => {
    store.setNodeItem(node.getId(), {
      type: ContentName.Section,
      title: val,
    });
  };

  const handleUpdateListSymbol = (val: string) => {
    store.setNodeItem(node.getId(), {
      type: ContentName.List,
      symbol: val,
    });
  };

  const handleUpdateImage = (val: { src: string; caption: string }) => {
    store.setNodeItem(node.getId(), {
      type: ContentName.Image,
      src: val.src,
      caption: val.caption,
    });
  };

  // Re-assemble a dummy Content object to pass to block input renderers
  const contentObject = {
    id: node.getId(),
    ...item,
    ...(item.type === ContentName.Section || item.type === ContentName.List ? { content: [] } : {}),
  } as ArticleContent;

  const renderContextMenu = ({ onClose }: { onClose: () => void }) => (
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

  return (
    <ContextMenuWrapper menu={renderContextMenu}>
      <div
        {...node.getProps()}
        style={{
          paddingLeft: `${level * 32}px`,
          opacity: isDragging ? 0.4 : undefined,
        }}
        className={mergeClass(
          "relative group/block flex items-center w-full gap-2 py-2 px-2 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 rounded-xl transition-all border border-transparent focus:outline-none focus:border-blue-500/30",
          isOver && "bg-blue-500/5 dark:bg-blue-600/5",
          isTargetAbove && "border-t-2 border-t-blue-500",
          isTargetBelow && "border-b-2 border-b-blue-500"
        )}
      >
        {/* Visual Guidelines for Nested Items */}
        {Array.from({ length: level }).map((_, i) => (
          <div
            key={i}
            className="absolute border-l-2 border-dashed border-slate-200 dark:border-slate-800"
            style={{
              left: `${(i + 1) * 32 - 16}px`,
              top: 0,
              bottom: 0,
            }}
          />
        ))}

        {/* Drag handle appearing on the left when hovering */}
        <div
          className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover/block:opacity-100 transition-opacity duration-150 z-10 select-none flex items-center gap-1"
          style={{ left: `${level * 32 + 4}px` }}
        >
          {node.isFolder() ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (node.isExpanded()) {
                  node.collapse();
                } else {
                  node.expand();
                }
              }}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 dark:text-slate-600 focus:outline-none"
              title={node.isExpanded() ? "Collapse" : "Expand"}
            >
              <svg
                className={mergeClass(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  node.isExpanded() ? "rotate-90" : ""
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <div className="w-5.5" />
          )}

          <button
            type="button"
            {...node.getDragHandleProps()}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-600 cursor-grab active:cursor-grabbing touch-none focus:outline-none"
            title="Drag to Reorder"
          >
            {/* Grabber/dots icon */}
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
            </svg>
          </button>
        </div>

        {/* Specific Block Input Type Renderers with pl-15 offset for drag handle */}
        <div className="w-full pl-15">
          {item.type === ContentName.Paragraph && (
            <ParagraphInput
              content={contentObject as Paragraph}
              onChange={handleUpdateParagraph}
              onInsertBelow={onInsertBelow}
            />
          )}

          {item.type === ContentName.Section && (
            <SectionInput
              content={contentObject as Section}
              onChangeTitle={handleUpdateSectionTitle}
            />
          )}

          {item.type === ContentName.List && (
            <ListInput content={contentObject as List} onChangeSymbol={handleUpdateListSymbol} />
          )}

          {item.type === ContentName.Image && (
            <ImageInput content={contentObject as Image} onChange={handleUpdateImage} />
          )}
        </div>
      </div>
    </ContextMenuWrapper>
  );
}

// Simple local fallback for mergeClass to avoid build issues if it cannot be found
function mergeClass(...classes: unknown[]) {
  return classes.filter(Boolean).join(" ");
}
