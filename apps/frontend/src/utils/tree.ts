/**
 * Represents a node in a generic nested/normal tree structure.
 *
 * @template T - The type of the custom item associated with the node.
 */
type GenericItemTreeNode<T = undefined> = {
  id?: string;
  name: string;
  item?: T;
  children: GenericItemTreeNode<T>[];
};

/**
 * Represents a node in a flattened tree structure where parent-child relationships
 * are maintained via string IDs rather than direct nesting.
 *
 * @template T - The type of the custom item associated with the node.
 */
type GenericFlattenItemTreeNode<T = undefined> = {
  id: string;
  parent: string | null;
  children: string[];

  name: string;
  item?: T;
};

/**
 * Represents a dictionary-like map of node IDs to flattened tree nodes.
 *
 * @template T - The type of the custom item associated with the node.
 */
type GenericFlattenItemTree<T = undefined> = {
  [key in string]: GenericFlattenItemTreeNode<T>;
};

/**
 * Generates a random UUID (v4) string. Uses standard crypto API if available,
 * with a fallback random-based generation for older environments.
 *
 * @returns A random UUID string.
 */
function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Interface defining the base operations and properties of a generic tree.
 *
 * @template T - The type of the custom item associated with the nodes.
 */
export interface GenericTree<T = undefined> {
  /**
   * The root node of the flattened tree structure.
   */
  readonly root: GenericFlattenItemTreeNode<T>;

  /**
   * The complete tree structure represented as a nested tree node.
   */
  readonly tree: GenericItemTreeNode<T>;

  /**
   * Retrieves a flattened node by its ID.
   *
   * @param id - The ID of the node.
   * @returns The flattened node, or null if not found.
   */
  getNode(id: string): GenericFlattenItemTreeNode<T> | null;

  /**
   * Check if the given {@link childId} node is a child node of the given {@link id} node.
   *
   * @param id - The parent node id to check.
   * @param childId - The child node id to check.
   */
  isDescendant(id: string, childId: string): boolean;

  /**
   * Adds a new nested node tree to the tree under the specified parent.
   *
   * @param node - The nested node structure to add.
   * @param parent - The ID of the parent node. Defaults to root.
   */
  addNode(node: GenericItemTreeNode<T>, parent?: string): void;

  /**
   * Deletes a node and all of its descendants from the tree.
   *
   * @param id - The ID of the node to delete.
   */
  deleteNode(id: string): void;

  /**
   * Reorders or updates the children IDs of a specific node.
   *
   * @param id - The ID of the node to update children for.
   * @param children - The ordered array of child node IDs.
   */
  updateChildren(id: string, children: string[]): void;
}

/**
 * Internal class handling tree traversal, flattening, unflattening,
 * addition, deletion, and node updates.
 *
 * @template T - The type of the custom item associated with the nodes.
 */
class GenericTreeHandler<T = undefined> implements GenericTree<T> {
  /**
   * The ID of the root node.
   */
  private rootId: string;

  /**
   * Dictionary mapping node IDs to their flattened representation.
   */
  private flattenTree: GenericFlattenItemTree<T>;

  /**
   * Constructs a GenericTreeHandler instance.
   *
   * @param tree - A single root node or an array of nodes to populate.
   */
  constructor(tree: GenericItemTreeNode<T> | GenericItemTreeNode<T>[]) {
    if (Array.isArray(tree)) {
      const root: GenericItemTreeNode<T> = {
        name: "root",
        children: tree,
      };

      tree = root;
    }

    const rootNode = this.createFlattenTreeNode(tree);

    this.rootId = rootNode.id;
    this.flattenTree = { [this.rootId]: rootNode };

    tree.children.forEach((node) => this.addNode(node));
  }

  /**
   * Gets the root node of the flattened tree.
   */
  get root() {
    return this.flattenTree[this.rootId];
  }

  /**
   * Gets the nested normal tree representation.
   */
  get tree() {
    const root = this.getNode(this.rootId);

    return this.createNormalTreeNode(root);
  }

  /**
   * Retrieves a flattened node by its ID.
   *
   * @param id - The ID of the node.
   * @returns The flattened node, or null if not found.
   */
  getNode(id: string) {
    return this.flattenTree[id] ?? null;
  }

  /**
   * Check if the given {@link childId} node is a child node of the given {@link id} node.
   *
   * @param id - The parent node id to check.
   * @param childId - The child node id to check.
   */
  isDescendant(id: string, childId: string): boolean {
    const node = this.getNode(id);
    if (!node || !this.getNode(childId)) return false;

    return (
      node.children.includes(childId) ||
      node.children.some((cid) => this.isDescendant(cid, childId))
    );
  }

  /**
   * Adds a new nested node tree to the tree under the specified parent.
   *
   * @param node - The nested node structure to add.
   * @param parent - The ID of the parent node. Defaults to root.
   * @returns The ID of the newly added root node.
   */
  addNode(node: GenericItemTreeNode<T>, parent: string = this.rootId) {
    const rootNode = this.addNodeToFlattenTree(node, parent);

    const queue = node.children.map((node) => ({
      parent: rootNode.id,
      node,
    }));

    while (queue.length > 0) {
      const { node, parent } = queue.shift()!;

      const flattenNode = this.addNodeToFlattenTree(node, parent);

      queue.push(...node.children.map((node) => ({ parent: flattenNode.id, node })));
    }

    return rootNode.id;
  }

  /**
   * Updates the children list of a node and re-parents moving nodes.
   *
   * @param id - The ID of the node to update.
   * @param children - The new child IDs.
   */
  updateChildren(id: string, children: string[]) {
    const node = this.getNode(id);

    if (!node) return;

    node.children = children;

    children.forEach((childId) => {
      const node = this.getNode(childId);

      if (!node || !node.parent || node.parent === id) return;

      const oldParent = this.getNode(node.parent);

      if (!oldParent) return;

      oldParent.children = oldParent.children.filter((val) => val !== childId);

      node.parent = id;
    });
  }

  /**
   * Updates the custom item data of a specific node.
   *
   * @param id - The ID of the node.
   * @param item - The new item value.
   */
  updateItem(id: string, item: T) {
    const node = this.getNode(id);

    if (!node) return;

    node.item = item;
  }

  /**
   * Deletes a node and recursively cleans up all its child nodes.
   *
   * @param id - The ID of the node to delete.
   */
  deleteNode(id: string) {
    const queue: string[] = [id];

    while (queue.length > 0) {
      const id = queue.shift()!;
      const node = this.getNode(id);

      if (!node) continue;

      if (node.parent) {
        const parentNode = this.getNode(node.parent);

        if (parentNode) {
          parentNode.children = parentNode.children.filter((val) => val !== id);
        }
      }

      queue.push(...node.children);

      delete this.flattenTree[id];
    }
  }

  /**
   * Recursively reconstructs a normal nested tree structure from a flattened tree node.
   *
   * @param node - The starting flattened node.
   * @returns The constructed nested normal tree node.
   */
  private createNormalTreeNode(node: GenericFlattenItemTreeNode<T>): GenericItemTreeNode<T> {
    const { parent: _, children, ...info } = node;

    const childNodes = children
      .filter((id) => Boolean(this.getNode(id)))
      .map((id) => {
        const node = this.getNode(id);

        return this.createNormalTreeNode(node);
      });

    return { ...info, children: childNodes };
  }

  /**
   * Creates a new flattened representation of a normal nested node.
   *
   * @param node - The normal tree node.
   * @param parent - The optional parent ID.
   * @returns The created flattened node.
   */
  private createFlattenTreeNode(
    node: GenericItemTreeNode<T>,
    parent?: string
  ): GenericFlattenItemTreeNode<T> {
    const { children: _, id = generateUUID(), ...info } = node;

    return { ...info, id, parent: parent ?? null, children: [] };
  }

  /**
   * Adds a node to the internal flattened dictionary structure and registers it with the parent.
   *
   * @param node - The node to add.
   * @param parent - The ID of the parent node.
   * @returns The registered flattened node.
   */
  private addNodeToFlattenTree(
    node: GenericItemTreeNode<T> | GenericFlattenItemTreeNode<T>,
    parent: string = this.rootId
  ) {
    const parentNode = this.getNode(parent);

    if (!parentNode) throw new Error("Cannot add to an unexisted node");

    const flattenNode = "parent" in node ? node : this.createFlattenTreeNode(node, parent);

    this.flattenTree[flattenNode.id] = flattenNode;
    this.getNode(parent)?.children.push(flattenNode.id);

    return flattenNode;
  }
}

export interface GenericTreeStore<T = undefined> extends GenericTree<T> {
  /**
   * Subscribes a listener callback to any structure changes of the tree (addition, deletion, reordering).
   *
   * @param listener - The callback function to invoke.
   * @returns A cleanup function to unsubscribe the listener.
   */
  subscribe(listener: () => void): () => void;
  /**
   * Subscribes a listener callback to changes of a specific node's item.
   *
   * @param id - The ID of the node to subscribe to.
   * @returns A stable readonly tuple containing:
   *   - `subscribe`: A function that registers a callback and returns an unsubscribe function.
   *   - `getSnapshot`: A function that returns the current item state of the node.
   * Designed to be passed directly to React's `useSyncExternalStore`.
   */
  subscribeNode(
    id: string
  ): readonly [subscribe: (listener: () => void) => () => void, getSnapshot: () => T | undefined];
  /**
   * Gets the root nested normal tree structure.
   *
   * @returns The complete nested tree structure.
   */
  get(): GenericItemTreeNode<T>;
  /**
   * Updates a specific node's custom item data.
   *
   * @param id - The ID of the node to update.
   * @param item - The new item value.
   */
  setNodeItem(id: string, item: T): void;
}

/**
 * A store wrapper for a generic tree that implements basic publish/subscribe mechanisms.
 * Supports subscribing to the entire tree structure changes, or selectively to individual node updates.
 *
 * @template T - The type of the custom item associated with the nodes.
 */
class GenericItemTreeStore<T = undefined> implements GenericTreeStore<T> {
  private readonly handler: GenericTreeHandler<T>;
  private readonly listeners: Set<() => void>;
  private readonly nodeListeners: Record<string, Set<() => void>>;
  private treeCache: GenericItemTreeNode<T> | null;

  /**
   * Constructs a new GenericItemTreeStore instance.
   *
   * @param arg - Constructor parameters for the underlying GenericTreeHandler.
   */
  constructor(...arg: ConstructorParameters<typeof GenericTreeHandler<T>>) {
    this.handler = new GenericTreeHandler<T>(...arg);
    this.listeners = new Set();
    this.nodeListeners = {};
    this.treeCache = null;
  }

  /**
   * Subscribes a callback to any structural mutations of the tree.
   *
   * @param listener - The callback function.
   * @returns A cleanup function to unsubscribe.
   */
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };

  /**
   * Subscribes a listener callback to changes of a specific node's item.
   *
   * @param id - The ID of the node to subscribe to.
   * @returns A stable readonly tuple containing:
   *   - `subscribe`: A function that registers a callback and returns an unsubscribe function.
   *   - `getSnapshot`: A function that returns the current item state of the node.
   * Designed to be passed directly to React's `useSyncExternalStore`.
   */
  subscribeNode = (id: string) => {
    const subscribe = (listener: () => void) => {
      if (!this.nodeListeners[id]) this.nodeListeners[id] = new Set();

      this.nodeListeners[id].add(listener);

      return () => {
        this.nodeListeners[id].delete(listener);

        if (this.nodeListeners[id].size === 0) delete this.nodeListeners[id];
      };
    };

    const getSnapshot = () => {
      const node = this.getNode(id);

      return node?.item;
    };

    return [subscribe, getSnapshot] as const;
  };

  /**
   * Gets the cached tree structure or rebuilds it if the cache is invalidated.
   *
   * @returns The nested normal tree structure.
   */
  get = () => {
    if (!this.treeCache) {
      this.treeCache = this.handler.tree;
    }

    return this.treeCache;
  };

  /**
   * Getter returning the current nested normal tree structure.
   */
  get tree() {
    return this.get();
  }

  /**
   * Retrieves a flattened node by its ID.
   *
   * @param id - The ID of the node.
   * @returns The flattened node, or null if not found.
   */
  getNode(id: string) {
    return this.handler.getNode(id);
  }

  /**
   * Check if the given {@link childId} node is a child node of the given {@link id} node.
   *
   * @param id - The parent node id to check.
   * @param childId - The child node id to check.
   */
  isDescendant(id: string, childId: string) {
    return this.handler.isDescendant(id, childId);
  }

  /**
   * Gets the root node of the flattened tree structure.
   */
  get root() {
    return this.handler.root;
  }

  /**
   * Adds a node tree under a specified parent and notifies all tree-structure subscribers.
   *
   * @param node - The node tree to add.
   * @param parent - The optional parent node ID.
   * @returns The ID of the added node.
   */
  addNode(node: GenericItemTreeNode<T>, parent?: string) {
    const id = this.handler.addNode(node, parent);
    this.notify();

    return id;
  }

  /**
   * Deletes a node and recursively cleans up any descendants and their node listeners.
   *
   * @param id - The ID of the node to delete.
   */
  deleteNode(id: string) {
    const idsToDelete: string[] = [];
    const queue = [id];
    // Collect all descendant IDs in the sub-tree to prevent memory leaks in nodeListeners
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const node = this.getNode(currentId);
      if (node) {
        idsToDelete.push(currentId);
        queue.push(...node.children);
      }
    }

    this.handler.deleteNode(id);

    // Remove obsolete listeners from the registry
    idsToDelete.forEach((deletedId) => {
      delete this.nodeListeners[deletedId];
    });

    this.notify();
  }

  /**
   * Updates children of a specific node and notifies structural subscribers.
   *
   * @param id - The ID of the node.
   * @param children - The new ordered child IDs.
   */
  updateChildren(id: string, children: string[]) {
    this.handler.updateChildren(id, children);
    this.notify();
  }

  /**
   * Updates a specific node's item and invalidates the global treeCache.
   *
   * @param id - The ID of the node to update.
   * @param item - The new item value.
   */
  setNodeItem(id: string, item: T) {
    const node = this.getNode(id);
    if (node) {
      node.item = item;
      this.nodeNotify(id);
    }
  }

  /**
   * Invalidates treeCache and notifies all structural tree subscribers.
   */
  private notify() {
    this.treeCache = null;
    this.listeners.forEach((listener) => listener());
  }

  /**
   * Invalidates the global treeCache and notifies listeners subscribed to the specific node ID.
   *
   * @param id - The ID of the node whose listeners should be notified.
   */
  private nodeNotify(id: string) {
    this.treeCache = null;
    this.nodeListeners[id]?.forEach((listener) => listener());
  }
}

export type { GenericItemTreeNode, GenericFlattenItemTree, GenericFlattenItemTreeNode };

export { GenericTreeHandler, GenericItemTreeStore };
