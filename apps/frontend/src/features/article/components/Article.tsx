import { Section } from "./display/Section";
import { Paragraph } from "./display/Paragraph";
import { Picture } from "./display/Image";
import { List } from "./display/List";
import { ContentName, Content, Article, generateId } from "@/utils/article";

const Components = {
  [ContentName.Paragraph]: Paragraph,
  [ContentName.Section]: Section,
  [ContentName.Image]: Picture,
  [ContentName.List]: List,
};

function ContentListComponent({
  contents,
  prefix,
  parent,
}: {
  contents: Content[];
  prefix?: string;
  parent: ContentName;
}) {
  let sectionCount = 1;
  return contents.map((content, index) => {
    const Component = Components[content.type];

    let sectionPrefix = undefined;
    if (parent === ContentName.List) {
      sectionPrefix = prefix;
    } else if (content.type === ContentName.Section) {
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
              content.type === ContentName.List ? content.symbol : sectionPrefix
            }
          />
        )}
      </Component>
    );
  });
}

function ArticleComponent({ article }: { article: Article }) {
  return (
    <article className="flex flex-col gap-2 w-full">
      <h1 className="font-bold text-4xl my-5">{article.title}</h1>
      <Paragraph
        content={{
          id: generateId(),
          type: ContentName.Paragraph,
          content: article.standfirst,
        }}
      />
      <ContentListComponent
        parent={ContentName.Section}
        contents={article.content}
      />
    </article>
  );
}

export { ArticleComponent };
