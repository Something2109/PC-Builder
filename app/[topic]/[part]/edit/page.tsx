"use client";

import { EditableArticle } from "@/components/articles/Form";
import * as Article from "@/utils/article";
import { Button, RedirectButton } from "@/components/utils/Button";
import { NotificationBar } from "@/components/utils/NotificationBar";
import { use, useEffect, useState } from "react";
import { ColumnWrapper, RowWrapper } from "@/components/utils/FlexWrapper";
import axios, { AxiosError } from "axios";

export default function PartTopicEditPage({
  params,
}: {
  params: Promise<{ topic: string; part: string }>;
}) {
  const { topic, part } = use(params);
  const [data, setData] = useState<Omit<Article.Type, "id"> | null>(null);
  const [error, setError] = useState<{ message: string }>({
    message: "Loading",
  });
  const [notification, setNoti] = useState<{
    message: string;
    alert: boolean;
  } | null>(null);
  const pageLink = `/${topic}/${part}`;
  const SaveLink = `/api/${topic}/${part}`;

  useEffect(() => {
    fetch(SaveLink).then((response) => {
      if (response.ok) {
        response.json().then((data: Article.Type) => {
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

    try {
      const response = await axios.post(SaveLink, data, {
        withCredentials: true,
      });
      setData(response.data);
      setNoti({ message: "Save successful", alert: false });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message =
        error.response?.data.message ?? "Cannot connect to server.";

      setNoti({ message, alert: true });
      setData({
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
      <ColumnWrapper className="sticky top-16 md:top-32 bg-white dark:bg-background">
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

      <EditableArticle article={data as Article.Type} />
    </>
  ) : (
    <h1>{error.message}</h1>
  );
}
