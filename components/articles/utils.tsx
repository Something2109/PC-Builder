import { ContentType } from "@/models/articles/article";
import { Paragraph, ParagraphInput } from "./Paragraph";
import { Picture, PictureInput } from "./Image";
import { List, ListInput } from "./List";
import { Section, SectionInput } from "./Section";
import { Button } from "@/components/utils/Button";

export function RowWrapper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-row gap-1 w-full ${className}`}>{children}</div>
  );
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

export type InputContentParameters<T extends ContentType> = {
  content: T;
  prefix?: string;
  updateSelf: ReturnType<typeof updateContent<any>>;
};

export function InputRenderer({
  content,
  prefix,
  updateSelf,
}: InputContentParameters<ContentType>) {
  let element: React.ReactNode;

  switch (content.type) {
    case "paragraph":
      element = (
        <ParagraphInput
          content={content}
          prefix={prefix}
          updateSelf={updateSelf}
        />
      );
      break;
    case "section":
      element = (
        <SectionInput
          content={content}
          prefix={prefix}
          updateSelf={updateSelf}
        />
      );
      break;
    case "image":
      element = (
        <PictureInput
          content={content}
          prefix={prefix}
          updateSelf={updateSelf}
        />
      );
      break;
    case "list":
      element = (
        <ListInput content={content} prefix={prefix} updateSelf={updateSelf} />
      );
      break;
  }

  return element;
}

export function InputArea({
  rows,
  placeholder,
  className,
  defaultValue,
  onChange,
}: {
  rows: number;
  placeholder: string;
  className?: string;
  defaultValue: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <textarea
      rows={rows}
      placeholder={placeholder}
      className={`w-full bg-transparent resize-none ${className}`}
      defaultValue={defaultValue}
      onChange={(e) => onChange(e)}
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
    <div className="flex flex-row gap-2 w-full">
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
    </div>
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
