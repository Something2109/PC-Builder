"use client";

import type { ItemInstance } from "@headless-tree/core";

import { Content as ArticleContent, ContentName } from "@pc-builder/shared/article";

import { ContextMenuWrapper } from "@/components/ui/ContextMenu";
import { useGenericTree } from "@/hooks/useGenericTree";
import { GenericItemTreeStore, GenericFlattenItemTreeNode } from "@/utils/tree";

import { ArticleTreeItemData } from "../../utils/articleTreeMapper";
import { ArticleContextMenu } from "../form/ContextMenu";
import { EditorBlock } from "./EditorBlock";

const defaultValue: { [key in ContentName]: () => ArticleContent } = {
  [ContentName.Section]: () => ({
    id: Math.random().toString(36).substring(2, 9),
    type: ContentName.Section,
    title: "",
    content: [],
  }),
  [ContentName.Paragraph]: () => ({
    id: Math.random().toString(36).substring(2, 9),
    type: ContentName.Paragraph,
    content: "",
  }),
  [ContentName.Image]: () => ({
    id: Math.random().toString(36).substring(2, 9),
    type: ContentName.Image,
    src: "",
    caption: "",
  }),
  [ContentName.List]: () => ({
    id: Math.random().toString(36).substring(2, 9),
    type: ContentName.List,
    symbol: "•",
    content: [],
  }),
};

interface ContentListInputProps {
  store: GenericItemTreeStore<ArticleTreeItemData>;
}

export function ContentListInput({ store }: ContentListInputProps) {
  const tree = useGenericTree(store, {
    getItemName: (node) => {
      if (node.item?.type === ContentName.Section) {
        return node.item.title || "";
      }
      return node.name;
    },
    isItemFolder: (node) => {
      return node.item?.type === ContentName.Section || node.item?.type === ContentName.List;
    },
  });

  // Action handlers
  const handleAppendBlock = (type: ContentName) => {
    const val = defaultValue[type]();
    const { id, ...rest } = val;
    store.addNode({
      id,
      name: type,
      item: rest as ArticleTreeItemData,
      children: [],
    });
  };

  const handleInsertBlockBelow = (targetNodeId: string, type: ContentName) => {
    const val = defaultValue[type]();
    const { id, ...rest } = val;

    const targetNode = store.getNode(targetNodeId);
    if (!targetNode) return;

    const parentId = targetNode.parent || "root";
    const parentNode = store.getNode(parentId);
    if (!parentNode) return;

    const newNodeId = store.addNode(
      {
        id,
        name: type,
        item: rest as ArticleTreeItemData,
        children: [],
      },
      parentId
    );

    // Reorder so it appears directly below the target node
    const currentChildren = [...parentNode.children];
    const targetIndex = currentChildren.indexOf(targetNodeId);
    if (targetIndex !== -1) {
      const filtered = currentChildren.filter((cid) => cid !== newNodeId);
      filtered.splice(targetIndex + 1, 0, newNodeId);
      store.updateChildren(parentId, filtered);
    }
  };

  const handleDeleteBlock = (nodeId: string) => {
    store.deleteNode(nodeId);
  };

  const handleMoveUp = (nodeId: string) => {
    const node = store.getNode(nodeId);
    if (!node) return;
    const parentId = node.parent || "root";
    const parentNode = store.getNode(parentId);
    if (!parentNode) return;
    const children = [...parentNode.children];
    const index = children.indexOf(nodeId);
    if (index > 0) {
      [children[index], children[index - 1]] = [children[index - 1], children[index]];
      store.updateChildren(parentId, children);
    }
  };

  const handleMoveDown = (nodeId: string) => {
    const node = store.getNode(nodeId);
    if (!node) return;
    const parentId = node.parent || "root";
    const parentNode = store.getNode(parentId);
    if (!parentNode) return;
    const children = [...parentNode.children];
    const index = children.indexOf(nodeId);
    if (index !== -1 && index < children.length - 1) {
      [children[index], children[index + 1]] = [children[index + 1], children[index]];
      store.updateChildren(parentId, children);
    }
  };

  const visibleNodes = tree.getItems();

  return (
    <div className="w-full">
      {/* Headless Tree Container */}
      <div {...tree.getContainerProps()} className="space-y-1 w-full focus:outline-none">
        {visibleNodes.map(
          (node: ItemInstance<GenericFlattenItemTreeNode<ArticleTreeItemData>>, index: number) => {
            return (
              <ContextMenuWrapper
                key={node.getId()}
                menu={({ onClose }) => (
                  <ArticleContextMenu
                    index={index}
                    totalNodes={visibleNodes.length}
                    onInsertBelow={(type) => handleInsertBlockBelow(node.getId(), type)}
                    onDelete={() => handleDeleteBlock(node.getId())}
                    onMoveUp={() => handleMoveUp(node.getId())}
                    onMoveDown={() => handleMoveDown(node.getId())}
                    onClose={onClose}
                  />
                )}
              >
                <EditorBlock node={node} store={store} />
              </ContextMenuWrapper>
            );
          }
        )}
      </div>

      {/* Quick Add Inline Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-6 pb-4 select-none">
        <button
          type="button"
          onClick={() => handleAppendBlock(ContentName.Paragraph)}
          className="flex items-center gap-1 py-1.5 px-3.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-900/50 dark:hover:bg-blue-950/20 text-xs text-slate-500 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
        >
          <span>✏️</span> Add Paragraph
        </button>
        <button
          type="button"
          onClick={() => handleAppendBlock(ContentName.Section)}
          className="flex items-center gap-1 py-1.5 px-3.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-900/50 dark:hover:bg-blue-950/20 text-xs text-slate-500 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
        >
          <span>Heading</span> Add Section
        </button>
        <button
          type="button"
          onClick={() => handleAppendBlock(ContentName.Image)}
          className="flex items-center gap-1 py-1.5 px-3.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-900/50 dark:hover:bg-blue-950/20 text-xs text-slate-500 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
        >
          <span>🖼️</span> Add Image
        </button>
        <button
          type="button"
          onClick={() => handleAppendBlock(ContentName.List)}
          className="flex items-center gap-1 py-1.5 px-3.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-900/50 dark:hover:bg-blue-950/20 text-xs text-slate-500 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
        >
          <span>•</span> Add List
        </button>
      </div>
    </div>
  );
}
