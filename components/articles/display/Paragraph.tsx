import * as Article from "@/utils/article";
import { RowWrapper } from "@/components/utils/FlexWrapper";
import { ContentProps } from "../utils";

export function Paragraph({
  content,
  prefix,
}: ContentProps<Article.Paragraph>) {
  const paragraph = <p className="text-xl">{content.content}</p>;
  return prefix ? (
    <RowWrapper>
      <p className="text-xl">{prefix}</p>
      {paragraph}
    </RowWrapper>
  ) : (
    paragraph
  );
}
