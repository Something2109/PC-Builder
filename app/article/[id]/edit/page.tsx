"use client";

import { EditableArticle } from "@/components/article";
import { Article } from "@/utils/interface/article/article";
import { Button, RedirectButton } from "@/components/utils/Button";
import { NotificationBar } from "@/components/utils/NotificationBar";
import { use, useEffect, useState } from "react";
import { ColumnWrapper, RowWrapper } from "@/components/utils/FlexWrapper";
import { AuthRole } from "@/components/auth";
import { Roles } from "@/utils/Enum";

export default function ArticleEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<Omit<Article.Type, "id"> | null>(null);
  const [error, setError] = useState<{ message: string }>({
    message: "Loading",
  });
  const [notification, setNoti] = useState<{
    message: string;
    alert: boolean;
  } | null>(null);
  const pageLink = `/article/${id}`;
  const SaveLink = `/api/article/${id}`;

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
        title: "",
        author: "admin",
        standfirst: "",
        createdAt: new Date(),
        content: [],
      });
    }
  }

  return data ? (
    <AuthRole roles={[Roles.USER, Roles.ADMIN]}>
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
    </AuthRole>
  ) : (
    <h1>{error.message}</h1>
  );
}
