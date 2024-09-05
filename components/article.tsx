"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { ArticleType } from "@/models/articles/article";
import { Paragraph } from "@/components/articles/Paragraph";
import {
  AddRow,
  ContentRenderer,
  InputArea,
  InputRenderer,
  RowWrapper,
  updateContent,
} from "@/components/articles/utils";
import { Button } from "@/components/utils/Button";

function Article({ article }: { article: ArticleType }) {
  let sectionCount = 1;
  return (
    <article className="flex flex-col gap-2 w-full">
      <h1 className="font-bold text-4xl my-5">{article.title}</h1>
      <Paragraph>{article.standfirst}</Paragraph>
      {article.content.map((content, index) => (
        <ContentRenderer
          content={content}
          prefix={`${
            content.type === "section" ? sectionCount++ : sectionCount
          }.`}
          key={`${index + 1}.${content.type}`}
        />
      ))}
    </article>
  );
}

function EditableArticle({
  article,
  path,
  setArticle,
}: {
  article: ArticleType;
  path: string;
  setArticle: Dispatch<SetStateAction<ArticleType | null>>;
}) {
  const [change, setChange] = useState(0);
  const [notification, setNoti] = useState<{
    message: string;
    alert: boolean;
  } | null>(null);

  async function save() {
    setNoti(null);

    const response = await fetch(`/api/${path}`, {
      method: "POST",
      body: JSON.stringify(article),
    });
    if (response.ok) {
      setArticle(await response.json());
      setNoti({ message: "Save successful", alert: false });
    } else {
      setNoti({ message: (await response.json()).message, alert: true });
    }
  }

  let sectionCount = 1;
  return (
    <article className="flex flex-col gap-2 w-full">
      <InputArea
        rows={1}
        placeholder="Title"
        defaultValue={article.title}
        className="text-4xl font-bold my-5"
        onChange={(e) => (article.title = e.target.value)}
      />
      <InputArea
        rows={3}
        placeholder="Standfirst"
        defaultValue={article.standfirst}
        className="text-xl"
        onChange={(e) => (article.standfirst = e.target.value)}
      />
      {article.content.map((content, index) => (
        <InputRenderer
          key={new Date().getTime() + index}
          content={content}
          prefix={`${content.type === "section" ? sectionCount++ : undefined}.`}
          updateSelf={updateContent(article.content, content, setChange)}
        />
      ))}
      <AddRow list={article.content} set={setChange} />
      <Button className="w-full" onClick={() => save()}>
        Save
      </Button>
      <NotificationBar
        notification={notification}
        remove={() => setNoti(null)}
      />
    </article>
  );
}

function NotificationBar({
  notification,
  remove,
}: {
  notification: {
    message: string;
    alert: boolean;
  } | null;
  remove: Function;
}) {
  return notification ? (
    <RowWrapper
      className={`rounded-xl p-2 justify-between font-bold ${
        notification.alert ? "bg-red-700" : "bg-green-700"
      }`}
    >
      <p>{notification.message}</p>
      <button type="button" onClick={() => remove()}>
        X
      </button>
    </RowWrapper>
  ) : undefined;
}

export { Article, EditableArticle };
