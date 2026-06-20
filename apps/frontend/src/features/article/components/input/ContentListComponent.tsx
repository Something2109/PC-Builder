"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React from "react";

import { Content as ArticleContent, ContentName } from "@pc-builder/shared/article";

import { EditorBlock } from "./EditorBlock";

const Content = ContentName;

const defaultValue: { [key in ContentName]: () => ArticleContent } = {
  [Content.Section]: () => ({
    id: Math.random().toString(36).substring(2, 9),
    type: Content.Section,
    title: "",
    content: [],
  }),
  [Content.Paragraph]: () => ({
    id: Math.random().toString(36).substring(2, 9),
    type: Content.Paragraph,
    content: "",
  }),
  [Content.Image]: () => ({
    id: Math.random().toString(36).substring(2, 9),
    type: Content.Image,
    src: "",
    caption: "",
  }),
  [Content.List]: () => ({
    id: Math.random().toString(36).substring(2, 9),
    type: Content.List,
    symbol: "•",
    content: [],
  }),
};

// Helper to find the parent list of a given ID in the tree
function findParentList(list: ArticleContent[], id: string): ArticleContent[] | null {
  if (list.some((item) => item.id === id)) {
    return list;
  }
  for (const item of list) {
    if ((item.type === ContentName.Section || item.type === ContentName.List) && item.content) {
      const res = findParentList(item.content, id);
      if (res) return res;
    }
  }
  return null;
}

// Helper to replace a target array reference with a new array in the tree
function updateTreeArray(
  tree: ArticleContent[],
  targetArray: ArticleContent[],
  newArray: ArticleContent[]
): ArticleContent[] {
  if (tree === targetArray) {
    return newArray;
  }
  return tree.map((item) => {
    if ((item.type === ContentName.Section || item.type === ContentName.List) && item.content) {
      if (item.content === targetArray) {
        return { ...item, content: newArray };
      }
      return {
        ...item,
        content: updateTreeArray(item.content, targetArray, newArray),
      };
    }
    return item;
  });
}

// Helper to move item in the tree
function moveItemInTree(
  tree: ArticleContent[],
  activeId: string,
  overId: string
): ArticleContent[] {
  // 1. Find the parent list of the active item
  const activeParent = findParentList(tree, activeId);
  if (!activeParent) return tree;

  // 2. Find the parent list of the over item
  const overParent = findParentList(tree, overId);

  // If both active and over are in the same parent list
  if (overParent && activeParent === overParent) {
    const oldIndex = activeParent.findIndex((item) => item.id === activeId);
    const newIndex = activeParent.findIndex((item) => item.id === overId);
    if (oldIndex !== -1 && newIndex !== -1) {
      const nextList = arrayMove(activeParent, oldIndex, newIndex);
      return updateTreeArray(tree, activeParent, nextList);
    }
    return tree;
  }

  // If they are in different lists, or if overId is a container block (Section/List)
  // Let's find the active item to move
  const activeIdx = activeParent.findIndex((item) => item.id === activeId);
  if (activeIdx === -1) return tree;
  const activeItem = activeParent[activeIdx];

  // Remove active item from its parent
  const nextActiveParent = activeParent.filter((item) => item.id !== activeId);
  const tempTree = updateTreeArray(tree, activeParent, nextActiveParent);

  // Now locate the over parent and over item in the modified tree
  const nextOverParent = findParentList(tempTree, overId);
  if (!nextOverParent) {
    // Check if overId is a Section/List block container in the tree
    const findContainerAndInsert = (list: ArticleContent[]): ArticleContent[] | null => {
      const idx = list.findIndex((item) => item.id === overId);
      if (idx !== -1) {
        const item = list[idx];
        if (item.type === ContentName.Section || item.type === ContentName.List) {
          const nextList = [...list];
          nextList[idx] = {
            ...item,
            content: [activeItem, ...(item.content || [])],
          };
          return nextList;
        }
      }
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if ((item.type === ContentName.Section || item.type === ContentName.List) && item.content) {
          const res = findContainerAndInsert(item.content);
          if (res) {
            const nextList = [...list];
            nextList[i] = { ...item, content: res };
            return nextList;
          }
        }
      }
      return null;
    };

    const containerInsertRes = findContainerAndInsert(tempTree);
    if (containerInsertRes) return containerInsertRes;

    return tree;
  }

  // If we found the overParent
  const overIdx = nextOverParent.findIndex((item) => item.id === overId);
  if (overIdx === -1) return tree;

  const overItem = nextOverParent[overIdx];
  const updatedOverParent = [...nextOverParent];

  // If the target is a Section/List block, we insert the dragged item inside it as the first item
  if (overItem.type === ContentName.Section || overItem.type === ContentName.List) {
    updatedOverParent[overIdx] = {
      ...overItem,
      content: [activeItem, ...(overItem.content || [])],
    };
  } else {
    // Otherwise, insert it right before the target item
    updatedOverParent.splice(overIdx, 0, activeItem);
  }

  return updateTreeArray(tempTree, nextOverParent, updatedOverParent);
}

interface ContentListComponentProps {
  contents: ArticleContent[];
  prefix?: string;
  parent: ContentName;
  onUpdate: (updatedContents: ArticleContent[]) => void;
  isRoot?: boolean;
}

export function ContentListComponent({
  contents,
  prefix,
  parent,
  onUpdate,
  isRoot = false,
}: ContentListComponentProps) {
  let sectionCount = 1;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const newContents = moveItemInTree(contents, active.id as string, over.id as string);
      onUpdate(newContents);
    }
  };

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
      [nextContents[index], nextContents[index - 1]] = [
        nextContents[index - 1],
        nextContents[index],
      ];
      onUpdate(nextContents);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < contents.length - 1) {
      const nextContents = [...contents];
      [nextContents[index], nextContents[index + 1]] = [
        nextContents[index + 1],
        nextContents[index],
      ];
      onUpdate(nextContents);
    }
  };

  const handleAppendBlock = (type: ContentName) => {
    onUpdate([...contents, defaultValue[type]()]);
  };

  const items = contents.map((item, index) => item.id || `${item.type}-${index}`);

  const renderList = () => (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
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
      </div>
    </SortableContext>
  );

  return (
    <div className="w-full">
      {isRoot ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {renderList()}
        </DndContext>
      ) : (
        renderList()
      )}

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
