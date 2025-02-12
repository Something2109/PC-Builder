import { Article } from "@/utils/interface/article/article";
import { Paragraph, ParagraphInput } from "./Paragraph";
import { Picture, PictureInput } from "./Image";
import { List, ListInput } from "./List";
import { Section, SectionInput } from "./Section";
import { Button } from "@/components/utils/Button";
import { RowWrapper } from "@/components/utils/FlexWrapper";

export type ContentProps<T extends Article.Content> = {
  content: T;
  prefix?: string;
};

export function ContentRenderer(props: ContentProps<Article.Content>) {
  switch (props.content.type) {
    case "paragraph":
      return <Paragraph {...(props as ContentProps<Article.Paragraph>)} />;
    case "image":
      return <Picture {...(props as ContentProps<Article.Image>)} />;
    case "list":
      return <List {...(props as ContentProps<Article.List>)} />;
    case "section":
      return <Section {...(props as ContentProps<Article.Section>)} />;
  }
}

export type InputContentProps<T extends Article.Content> = {
  updateSelf: ReturnType<typeof updateContent<any>>;
} & ContentProps<T>;

export function InputRenderer(props: InputContentProps<Article.Content>) {
  switch (props.content.type) {
    case "paragraph":
      return (
        <ParagraphInput {...(props as InputContentProps<Article.Paragraph>)} />
      );
    case "section":
      return (
        <SectionInput {...(props as InputContentProps<Article.Section>)} />
      );
    case "image":
      return <PictureInput {...(props as InputContentProps<Article.Image>)} />;
    case "list":
      return <ListInput {...(props as InputContentProps<Article.List>)} />;
  }
}

export function AddRow({
  list,
  set,
}: {
  list: Article.Content[];
  set: React.Dispatch<React.SetStateAction<number>>;
}) {
  function add(ct: Article.Content) {
    list.push(ct);
    console.log(ct);
    set((prev) => ++prev);
  }

  return (
    <RowWrapper className="justify-center">
      <Button onClick={() => add({ type: "section", title: "", content: [] })}>
        Add Section
      </Button>
      <Button onClick={() => add({ type: "paragraph", content: "" })}>
        Add Paragraph
      </Button>
      <Button onClick={() => add({ type: "image", src: "", caption: "" })}>
        Add Picture
      </Button>
      <Button onClick={() => add({ type: "list", symbol: "*", content: [] })}>
        Add List
      </Button>
    </RowWrapper>
  );
}

export function updateContent<T>(
  list: T[],
  content: T,
  set: React.Dispatch<React.SetStateAction<number>>
) {
  return {
    shiftUp() {
      const index = list.indexOf(content);

      if (index > 0) {
        const before = list[index - 1];
        list[index - 1] = content;
        list[index] = before;
        set((prev) => ++prev);
      }
      console.log(list);
    },

    shiftDown() {
      const index = list.indexOf(content);
      if (index < list.length - 1) {
        const after = list[index + 1];
        list[index + 1] = content;
        list[index] = after;
        set((prev) => ++prev);
      }
      console.log(list);
    },

    remove() {
      list.splice(list.indexOf(content), 1);
      console.log(list);
      set((prev) => ++prev);
    },
  };
}
