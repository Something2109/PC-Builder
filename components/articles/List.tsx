import { ListType } from "@/models/articles/article";
import { ContentRenderer } from "./utils";

export function List({ section }: { section: ListType }) {
  return (
    <ul>
      {section.content.map((content, index) => (
        <li key={new Date().getTime() + index}>
          <ContentRenderer content={content} prefix={section.symbol} />
        </li>
      ))}
    </ul>
  );
}
