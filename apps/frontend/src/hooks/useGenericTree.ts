import type { GenericTreeStore, GenericFlattenItemTreeNode } from "../utils/tree";

import {
  hotkeysCoreFeature,
  syncDataLoaderFeature,
  dragAndDropFeature,
  keyboardDragAndDropFeature,
  createOnDropHandler,
} from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import { useEffect, useSyncExternalStore } from "react";

export interface UseGenericTreeOptions<T> {
  indent?: number;
  isItemFolder?: (node: GenericFlattenItemTreeNode<T>) => boolean;
  getItemName?: (node: GenericFlattenItemTreeNode<T>) => string;
}

export function useGenericTree<T>(
  treeStore: GenericTreeStore<T>,
  options: UseGenericTreeOptions<T> = {}
) {
  const { indent = 20, isItemFolder = () => true, getItemName = (node) => node.name } = options;

  const treeState = useSyncExternalStore(treeStore.subscribe, treeStore.get, treeStore.get);

  const tree = useTree<GenericFlattenItemTreeNode<T>>({
    indent,
    rootItemId: treeStore.root.id,
    getItemName: (item) => getItemName(item.getItemData()),
    isItemFolder: (item) => isItemFolder(item.getItemData()),
    seperateDragHandle: true,
    dataLoader: {
      getItem: (itemId) =>
        treeStore.getNode(itemId) ?? {
          id: itemId,
          parent: null,
          children: [],
          name: "",
        },
      getChildren: (itemId) => treeStore.getNode(itemId)?.children ?? [],
    },
    features: [
      syncDataLoaderFeature,
      hotkeysCoreFeature,
      dragAndDropFeature,
      keyboardDragAndDropFeature,
    ],
    onDrop: createOnDropHandler((parentItem, newChildren) => {
      const parentId = parentItem.getId();
      treeStore.updateChildren(parentId, newChildren);
    }),
    canDrop: (_items, target) => {
      const targetId = target.item.getId();
      if (!treeStore.getNode(targetId)) return false;
      return target.item.isFolder();
    },
  });

  // Rebuild the internal headless tree model whenever the store is mutated
  useEffect(() => {
    tree.rebuildTree();
  }, [treeState, tree]);

  return tree;
}
