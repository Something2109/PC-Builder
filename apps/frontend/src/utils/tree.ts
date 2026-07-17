type GenericItemTreeNode<T = undefined> = {
  id?: string;
  name: string;
  item?: T;
  children: GenericItemTreeNode<T>[];
};

type GenericFlattenItemTreeNode<T = undefined> = {
  id: string;
  parent: string | null;
  children: string[];

  name: string;
  item?: T;
};

type GenericFlattenItemTree<T = undefined> = {
  [key in string]: GenericFlattenItemTreeNode<T>;
};

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

export interface GenericTree<T = undefined> {
  readonly root: GenericFlattenItemTreeNode<T>;
  readonly tree: GenericItemTreeNode<T>;

  getNode(id: string): GenericFlattenItemTreeNode<T> | null;
  addNode(node: GenericItemTreeNode<T>, parent?: string): void;
  deleteNode(id: string): void;
  updateChildren(id: string, children: string[]): void;
}

class GenericTreeHandler<T = undefined> implements GenericTree<T> {
  private rootId: string;
  private flattenTree: GenericFlattenItemTree<T>;

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

  get root() {
    return this.flattenTree[this.rootId];
  }

  get tree() {
    const root = this.getNode(this.rootId);

    return this.createNormalTreeNode(root);
  }

  getNode(id: string) {
    return this.flattenTree[id] ?? null;
  }

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

  updateItem(id: string, item: T) {
    const node = this.getNode(id);

    if (!node) return;

    node.item = item;
  }

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

  private createFlattenTreeNode(
    node: GenericItemTreeNode<T>,
    parent?: string
  ): GenericFlattenItemTreeNode<T> {
    const { children: _, id = generateUUID(), ...info } = node;

    return { ...info, id, parent: parent ?? null, children: [] };
  }

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
  subscribe(listener: () => void): () => void;
  get(): GenericItemTreeNode<T>;
  setNodeItem(id: string, item: T): void;
}

class GenericItemTreeStore<T = undefined> implements GenericTreeStore<T> {
  private readonly handler: GenericTreeHandler<T>;
  private readonly listeners: Set<() => void>;
  private treeCache: GenericItemTreeNode<T> | null;

  constructor(...arg: ConstructorParameters<typeof GenericTreeHandler<T>>) {
    this.handler = new GenericTreeHandler<T>(...arg);
    this.listeners = new Set();
    this.treeCache = null;
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };

  get = () => {
    if (!this.treeCache) {
      this.treeCache = this.handler.tree;
    }

    return this.treeCache;
  };

  get tree() {
    return this.get();
  }

  getNode(id: string) {
    return this.handler.getNode(id);
  }

  get root() {
    return this.handler.root;
  }

  addNode(node: GenericItemTreeNode<T>, parent?: string) {
    const id = this.handler.addNode(node, parent);
    this.notify();

    return id;
  }

  deleteNode(id: string) {
    this.handler.deleteNode(id);
    this.notify();
  }

  updateChildren(id: string, children: string[]) {
    this.handler.updateChildren(id, children);
    this.notify();
  }

  setNodeItem(id: string, item: T) {
    const node = this.getNode(id);
    if (node) {
      node.item = item;
      this.notify();
    }
  }

  private notify() {
    this.treeCache = null;
    this.listeners.forEach((listener) => listener());
  }
}

export type { GenericItemTreeNode, GenericFlattenItemTree, GenericFlattenItemTreeNode };

export { GenericTreeHandler, GenericItemTreeStore };
