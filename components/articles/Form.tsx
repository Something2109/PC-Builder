"use client";

import { lazy, useActionState, useCallback, useState } from "react";
import { Article } from "@/utils/interface/article/article";
import { TextArea } from "@/components/utils/Input";
import { ColumnWrapper, RowWrapper } from "../utils/FlexWrapper";
import { Button, RedirectButton } from "../utils/Button";
import { NotificationBar } from "../utils/NotificationBar";
import axios, { AxiosError } from "axios";

const Content = Article.ContentName;

const Components = {
  [Content.Paragraph]: lazy(() => import("./input/Paragraph")),
  [Content.Section]: lazy(() => import("./input/Section")),
  [Content.Image]: lazy(() => import("./input/Image")),
  [Content.List]: lazy(() => import("./input/List")),
};

const defaultValue: { [key in Article.ContentName]: Article.Content } = {
  [Content.Section]: { type: Content.Section, title: "", content: [] },
  [Content.Paragraph]: { type: Content.Paragraph, content: "" },
  [Content.Image]: { type: Content.Image, src: "", caption: "" },
  [Content.List]: { type: Content.List, symbol: "*", content: [] },
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
  const [change, setChange] = useState(0);
  const add = useCallback((type: Article.ContentName) => {
    contents.push(defaultValue[type]);
    setChange((prev) => ++prev);
  }, []);
  const shiftUp = useCallback((index: number) => {
    [contents[index], contents[index - 1]] = [
      contents[index - 1],
      contents[index],
    ];
    setChange((prev) => ++prev);
  }, []);
  const shiftDown = useCallback((index: number) => {
    [contents[index], contents[index + 1]] = [
      contents[index + 1],
      contents[index],
    ];
    setChange((prev) => ++prev);
  }, []);
  const remove = useCallback((index: number) => {
    if (confirm("Are you sure you want to remove this content?")) {
      contents.splice(index, 1);
      setChange((prev) => ++prev);
    }
  }, []);

  let sectionCount = 1;
  return (
    <>
      {contents.map((content, index) => {
        const Component = Components[content.type];
        let sectionPrefix = undefined;
        if (parent === Content.List) {
          sectionPrefix = prefix;
        } else if (content.type === Content.Section) {
          sectionPrefix = `${prefix ?? ""}${sectionCount++}.`;
        }

        const EditPanelWrapper =
          content.type === Content.List || content.type === Content.Section
            ? RowWrapper
            : ColumnWrapper;

        return (
          <Component
            content={content as never}
            prefix={sectionPrefix}
            key={new Date().getTime() + index}
          >
            <EditPanelWrapper className="justify-center">
              {index !== 0 && (
                <Button onClick={() => shiftUp(index)}>Up</Button>
              )}
              <Button onClick={() => remove(index)}>Remove</Button>
              {index !== contents.length - 1 && (
                <Button onClick={() => shiftDown(index)}>Down</Button>
              )}
            </EditPanelWrapper>
            {"content" in content && typeof content.content !== "string" && (
              <ContentListComponent
                parent={content.type}
                contents={content.content}
                prefix={
                  content.type === Content.List ? content.symbol : sectionPrefix
                }
              />
            )}
          </Component>
        );
      })}
      <RowWrapper className="justify-center">
        <Button onClick={() => add(Content.Section)}>Add Section</Button>
        <Button onClick={() => add(Content.Paragraph)}>Add Paragraph</Button>
        <Button onClick={() => add(Content.Image)}>Add Picture</Button>
        <Button onClick={() => add(Content.List)}>Add List</Button>
      </RowWrapper>
    </>
  );
}

function EditableArticle({ article }: { article: Article.Type }) {
  const { id, ...initial } = article;
  const [notification, setNoti] = useState<{
    message: string;
    alert: boolean;
  } | null>(null);
  const [state, submit, pending] = useActionState<Omit<Article.Type, "id">>(
    async (data) => {
      setNoti(null);

      try {
        const response = await axios.post(`/api/article/${id}`, data, {
          withCredentials: true,
        });
        setNoti({ message: "Save successful", alert: false });

        return response.data;
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        const message =
          error.response?.data.message ?? "Cannot connect to server.";

        setNoti({ message, alert: true });
        alert(error.response?.data);
      }

      return data;
    },
    initial
  );

  return (
    <form action={submit}>
      <article className="flex flex-col gap-2 w-full">
        <ColumnWrapper className="sticky top-16 md:top-32 bg-white dark:bg-background">
          <RowWrapper className="*:w-full">
            <RedirectButton href={`/article/${id}`}>Back</RedirectButton>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save"}
            </Button>
          </RowWrapper>
          {notification ? (
            <NotificationBar
              message={notification.message}
              remove={() => setNoti(null)}
              alert={notification.alert}
            />
          ) : undefined}
        </ColumnWrapper>
        <TextArea
          placeholder="Title"
          defaultValue={state.title}
          className="text-4xl font-bold my-5"
          onChange={(e) => (state.title = e.target.value)}
        />
        <TextArea
          placeholder="Standfirst"
          defaultValue={state.standfirst}
          className="text-xl"
          onChange={(e) => (state.standfirst = e.target.value)}
        />
        <ContentListComponent
          parent={Content.Section}
          contents={state.content}
        />
      </article>
    </form>
  );
}

export { EditableArticle };
