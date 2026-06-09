import React from "react";

import { PartList } from "@/features/part";

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
