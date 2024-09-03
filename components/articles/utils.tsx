import { ContentType } from "@/models/articles/article";
import { Paragraph } from "./Paragraph";
import { Picture } from "./Image";
import { List } from "./List";
import { Section } from "./Section";

export function RowWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-row gap-1 w-full">{children}</div>;
}

export function ContentRenderer({
  content,
  prefix,
}: {
  content: ContentType;
  prefix: string;
}) {
  switch (content.type) {
    case "paragraph":
      return <Paragraph>{content.content}</Paragraph>;
    case "image":
      return <Picture img={content} />;
    case "list":
      return <List section={content} />;
    case "section":
      return <Section section={content} prefix={prefix} />;
  }
}
