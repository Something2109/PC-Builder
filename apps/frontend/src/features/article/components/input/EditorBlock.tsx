"use client";

import type { ArticleTreeItemData } from "../../utils/articleTreeMapper";
import type { GenericTreeStore, GenericFlattenItemTreeNode } from "@/utils/tree";
import type { ItemInstance } from "@headless-tree/core";

import {
  Content as ArticleContent,
  ContentName,
  Paragraph,
  Section,
  List,
  Image,
} from "@pc-builder/shared/article";
import React, { useMemo, useSyncExternalStore } from "react";

import { ImageInput } from "./ImageInput";
import { ListInput } from "./ListInput";
import { ParagraphInput } from "./ParagraphInput";
import { SectionInput } from "./SectionInput";

interface EditorBlockProps {
  node: ItemInstance<GenericFlattenItemTreeNode<ArticleTreeItemData>>;
  store: GenericTreeStore<ArticleTreeItemData>;
}

/**
 * EditorBlock component renders a single node (paragraph, section heading, image, list) in the article editor canvas.
 * It is subscribed to its specific node item's state changes to prevent unnecessary full-tree re-renders when typing.
 *
 * @param props - The props containing the node instance and the tree store.
 */
export function EditorBlock({ node, store }: EditorBlockProps) {
  const level = node.getItemMeta().level;
  const isDragging =
    node
      .getTree()
      .getState()
      .dnd?.draggedItems?.some((dragItem) => dragItem.getId() === node.getId()) || false;
  const isTargetAbove = node.isDragTargetAbove?.() || false;
  const isTargetBelow = node.isDragTargetBelow?.() || false;
  const isOver = node.isDraggingOver?.() || false;

  const [subscribe, getSnapshot] = useMemo(() => store.subscribeNode(node.getId()), [store, node]);
  const item = useSyncExternalStore(subscribe, getSnapshot);

  if (!item) return null;

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

  return (
    <div
      {...node.getProps()}
      style={{
        opacity: isDragging ? 0.4 : undefined,
      }}
      className="relative w-full focus:outline-none"
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

      {/* Inner Content Block */}
      <div
        style={{
          marginLeft: `${level * 32}px`,
        }}
        className={mergeClass(
          "relative group/block flex items-center gap-2 py-2 px-2 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 rounded-xl transition-all border border-transparent focus:outline-none focus:border-blue-500/30",
          isOver && "bg-blue-500/5 dark:bg-blue-600/5",
          isTargetAbove && "border-t-2 border-t-blue-500",
          isTargetBelow && "border-b-2 border-b-blue-500"
        )}
      >
        {/* Drag handle appearing on the left when hovering */}
        <div className="absolute top-1/2 left-1 -translate-y-1/2 opacity-0 group-hover/block:opacity-100 transition-opacity duration-150 z-10 select-none flex items-center gap-1">
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
            <ParagraphInput content={contentObject as Paragraph} onChange={handleUpdateParagraph} />
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
    </div>
  );
}

// Simple local fallback for mergeClass to avoid build issues if it cannot be found
function mergeClass(...classes: unknown[]) {
  return classes.filter(Boolean).join(" ");
}
