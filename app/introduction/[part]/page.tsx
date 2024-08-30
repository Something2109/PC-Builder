"use client";

import { useEffect, useState } from "react";
import { Article } from "@/components/article";
import { ArticleType } from "@/models/articles/article";

export default function PartListPage({ params }: { params: { part: string } }) {
  const [data, setData] = useState<ArticleType | null>(null);
  const [error, setError] = useState<{ message: string }>({
    message: "Loading",
  });

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

  return data ? (
    <Article article={data as ArticleType} />
  ) : (
    <h1>{error.message}</h1>
  );
}
