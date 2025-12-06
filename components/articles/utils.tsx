import * as Article from "@/utils/article";
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

const DisplayComponent = {
  [Article.ContentName.Paragraph]: Paragraph,
  [Article.ContentName.Image]: Picture,
  [Article.ContentName.List]: List,
  [Article.ContentName.Section]: Section,
};

export function ContentRenderer(props: ContentProps<Article.Content>) {
  const Component = DisplayComponent[props.content.type];
  return <Component {...(props as any)} />;
}

export type InputContentProps<T extends Article.Content> = {
  updateSelf: ReturnType<typeof updateContent<any>>;
} & ContentProps<T>;

const InputComponent = {
  [Article.ContentName.Paragraph]: ParagraphInput,
  [Article.ContentName.Image]: PictureInput,
  [Article.ContentName.List]: ListInput,
  [Article.ContentName.Section]: SectionInput,
};

export function InputRenderer(props: InputContentProps<Article.Content>) {
  const Component = InputComponent[props.content.type];
  return <Component {...(props as any)} />;
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
      <Button
        onClick={() =>
          add({ type: Article.ContentName.Section, title: "", content: [] })
        }
      >
        Add Section
      </Button>
      <Button
        onClick={() =>
          add({ type: Article.ContentName.Paragraph, content: "" })
        }
      >
        Add Paragraph
      </Button>
      <Button
        onClick={() =>
          add({ type: Article.ContentName.Image, src: "", caption: "" })
        }
      >
        Add Picture
      </Button>
      <Button
        onClick={() =>
          add({ type: Article.ContentName.List, symbol: "*", content: [] })
        }
      >
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
