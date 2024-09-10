"use client";

import { EditableArticle } from "@/components/article";
import { ArticleType } from "@/models/articles/article";
import { Button, RedirectButton } from "@/components/utils/Button";
import { NotificationBar } from "@/components/utils/NotificationBar";
import { useEffect, useState } from "react";
import { ColumnWrapper, RowWrapper } from "@/components/utils/FlexWrapper";

export default function PartTopicEditPage({
  params,
}: {
  params: { topic: string; part: string };
}) {
  const [data, setData] = useState<ArticleType | null>(null);
  const [error, setError] = useState<{ message: string }>({
    message: "Loading",
  });
  const [notification, setNoti] = useState<{
    message: string;
    alert: boolean;
  } | null>(null);
  const pageLink = `/${params.topic}/${params.part}`;
  const SaveLink = `/api/${params.topic}/${params.part}`;

  useEffect(() => {
    fetch(SaveLink).then((response) => {
      if (response.ok) {
        response.json().then((data: ArticleType) => {
          setData(data);
        });
      } else {
        response.json().then((data: { message: string }) => {
          setError(data);
        });
      }
    });
  }, []);

  async function save() {
    setNoti(null);

    const response = await fetch(SaveLink, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.ok) {
      setData(await response.json());
      setNoti({ message: "Save successful", alert: false });
    } else {
      setNoti({ message: (await response.json()).message, alert: true });
      setData({
        type: "article",
        title: "",
        author: "admin",
        standfirst: "",
        createdAt: new Date(),
        content: [],
      });
    }
  }

  return data ? (
    <>
      <ColumnWrapper className="sticky top-32 bg-white dark:bg-background">
        <RowWrapper className="*:w-full">
          <RedirectButton href={pageLink}>Back</RedirectButton>
          <Button onClick={save}>Save</Button>
        </RowWrapper>

        {notification ? (
          <NotificationBar
            message={notification.message}
            remove={() => setNoti(null)}
            alert={notification.alert}
          />
        ) : undefined}
      </ColumnWrapper>

      <EditableArticle article={data as ArticleType} />
    </>
  ) : (
    <h1>{error.message}</h1>
  );
}
