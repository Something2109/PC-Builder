import { PartList } from "@/features/part";
import React from "react";

export default async function TopicLayout({
  params,
  children,
}: {
  params: Promise<{ topic: string }>;
  children: React.ReactNode;
}) {
  const { topic } = await params;

  return (
    <>
      <PartList path={topic} />
      <section className="my-2">{children}</section>
    </>
  );
}
