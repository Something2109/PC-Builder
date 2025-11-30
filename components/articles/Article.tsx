import { Section } from "./display/Section";
import { Paragraph } from "./display/Paragraph";
import { Picture } from "./display/Image";
import { List } from "./display/List";
import * as Article from "@/utils/article";

export type ContentProps<T extends Article.Content> = {
  content: T;
  prefix?: string;
};

const Components = {
  [Article.ContentName.Paragraph]: Paragraph,
  [Article.ContentName.Section]: Section,
  [Article.ContentName.Image]: Picture,
  [Article.ContentName.List]: List,
};

function ContentListComponent({
  contents,
  prefix,
  parent,
}: {
  contents: Article.Content[];
  prefix?: string;
  parent: Article.ContentName;
}) {
  let sectionCount = 1;
  return contents.map((content, index) => {
    const Component = Components[content.type];

    let sectionPrefix = undefined;
    if (parent === Article.ContentName.List) {
      sectionPrefix = prefix;
    } else if (content.type === Article.ContentName.Section) {
      sectionPrefix = `${prefix ?? ""}${sectionCount++}.`;
    }

    return (
      <Component
        content={content as never}
        prefix={sectionPrefix}
        key={new Date().getTime() + index}
      >
        {""}
        {"content" in content && typeof content.content !== "string" && (
          <ContentListComponent
            parent={content.type}
            contents={content.content}
            prefix={
              content.type === Article.ContentName.List
                ? content.symbol
                : sectionPrefix
            }
          />
        )}
      </Component>
    );
  });
}

function ArticleComponent({ article }: { article: Article.Type }) {
  return (
    <article className="flex flex-col gap-2 w-full">
      <h1 className="font-bold text-4xl my-5">{article.title}</h1>
      <Paragraph
        content={{
          type: Article.ContentName.Paragraph,
          content: article.standfirst,
        }}
      />
      <ContentListComponent
        parent={Article.ContentName.Section}
        contents={article.content}
      />
    </article>
  );
}

export { ArticleComponent };
