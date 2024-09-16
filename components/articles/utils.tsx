import {
  ContentType,
  ImageType,
  ListType,
  ParagraphType,
  SectionType,
} from "@/models/articles/article";
import { Paragraph, ParagraphInput } from "./Paragraph";
import { Picture, PictureInput } from "./Image";
import { List, ListInput } from "./List";
import { Section, SectionInput } from "./Section";
import { Button } from "@/components/utils/Button";
import { RowWrapper } from "@/components/utils/FlexWrapper";
import { TextareaHTMLAttributes, useRef, useEffect } from "react";

export type ContentProps<T extends ContentType> = {
  content: T;
  prefix?: string;
};

export function ContentRenderer(props: ContentProps<ContentType>) {
  switch (props.content.type) {
    case "paragraph":
      return <Paragraph {...(props as ContentProps<ParagraphType>)} />;
    case "image":
      return <Picture {...(props as ContentProps<ImageType>)} />;
    case "list":
      return <List {...(props as ContentProps<ListType>)} />;
    case "section":
      return <Section {...(props as ContentProps<SectionType>)} />;
  }
}

export type InputContentProps<T extends ContentType> = {
  updateSelf: ReturnType<typeof updateContent<any>>;
} & ContentProps<T>;

export function InputRenderer(props: InputContentProps<ContentType>) {
  switch (props.content.type) {
    case "paragraph":
      return (
        <ParagraphInput {...(props as InputContentProps<ParagraphType>)} />
      );
    case "section":
      return <SectionInput {...(props as InputContentProps<SectionType>)} />;
    case "image":
      return <PictureInput {...(props as InputContentProps<ImageType>)} />;
    case "list":
      return <ListInput {...(props as InputContentProps<ListType>)} />;
  }
}

export function InputArea({
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  let classList = ["w-full bg-transparent resize-none overflow-y-hidden"];
  if (className) {
    classList.push(className);
  }

  const textarea = useRef<HTMLTextAreaElement>(null);
  const resize = () => {
    textarea.current!.style.height = "auto";
    textarea.current!.style.height = textarea.current!.scrollHeight + "px";
  };
  useEffect(resize, []);

  return (
    <textarea
      ref={textarea}
      rows={1}
      className={classList.join(" ")}
      onInput={resize}
      {...rest}
    />
  );
}

export function AddRow({
  list,
  set,
}: {
  list: ContentType[];
  set: React.Dispatch<React.SetStateAction<number>>;
}) {
  function add(ct: ContentType) {
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
