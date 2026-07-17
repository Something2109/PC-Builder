import { Content, ContentName } from "@pc-builder/shared/article";

import { GenericItemTreeNode } from "../../../utils/tree";

export type ArticleTreeItemData =
  | { type: ContentName.Paragraph; content: string }
  | { type: ContentName.Section; title: string }
  | { type: ContentName.List; symbol: string }
  | { type: ContentName.Image; src: string; caption: string };

export function mapContentToTreeNodes(
  contents: Content[]
): GenericItemTreeNode<ArticleTreeItemData>[] {
  return contents.map((block) => {
    const { id, ...rest } = block;
    const children =
      block.type === ContentName.Section || block.type === ContentName.List
        ? mapContentToTreeNodes(block.content || [])
        : [];

    const name = block.type;

    return {
      id,
      name,
      item: rest as ArticleTreeItemData,
      children,
    };
  });
}

export function mapTreeNodesToContent(
  nodes: GenericItemTreeNode<ArticleTreeItemData>[]
): Content[] {
  return nodes.map((node) => {
    const id = node.id!;
    const item = node.item!;

    if (item.type === ContentName.Section) {
      return {
        id,
        type: ContentName.Section,
        title: item.title || "",
        content: mapTreeNodesToContent(node.children),
      } as Content;
    }

    if (item.type === ContentName.List) {
      return {
        id,
        type: ContentName.List,
        symbol: item.symbol || "•",
        content: mapTreeNodesToContent(node.children),
      } as Content;
    }

    return {
      ...item,
      id,
    } as Content;
  });
}
