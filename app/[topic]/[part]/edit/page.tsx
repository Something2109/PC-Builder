"use client";

import { EditableArticle } from "@/components/article";
import { ArticleType } from "@/models/articles/article";
import { Button, RedirectButton } from "@/components/utils/Button";
import { NotificationBar } from "@/components/utils/NotificationBar";
import { useEffect, useState } from "react";
import { RowWrapper } from "@/components/utils/FlexWrapper";

export default function PartListPage({ params }: { params: { part: string } }) {
  const [data, setData] = useState<ArticleType | null>(null);
  const [error, setError] = useState<{ message: string }>({
    message: "Loading",
  });
  const [notification, setNoti] = useState<{
    message: string;
    alert: boolean;
  } | null>(null);

  useEffect(() => {
    fetch(`/api/introduction/${params.part}`).then((response) => {
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

    const response = await fetch(`/api/introduction/${params.part}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.ok) {
      setData(await response.json());
      setNoti({ message: "Save successful", alert: false });
    } else {
      setNoti({ message: (await response.json()).message, alert: true });
    }
  }

  return data ? (
    <>
      <RowWrapper className="sticky top-32 *:w-full bg-white dark:bg-background">
        <RedirectButton href={`/introduction/${params.part}`}>
          Back
        </RedirectButton>
        <Button onClick={save}>Save</Button>
      </RowWrapper>
      <EditableArticle article={data as ArticleType} />

      {notification ? (
        <NotificationBar
          message={notification.message}
          remove={() => setNoti(null)}
          alert={notification.alert}
        />
      ) : undefined}
    </>
  ) : (
    <h1>{error.message}</h1>
  );
}
