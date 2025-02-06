import PartList from "@/components/partlist";
import { Topics } from "@/utils/Enum";
import { notFound } from "next/navigation";
import React from "react";

export default async function TopicLayout({
  params,
  children,
}: {
  params: Promise<{ topic: string }>;
  children: React.ReactNode;
}) {
  const { topic } = await params;

  if (!Object.values(Topics).includes(topic as Topics)) {
    return notFound();
  }

  return (
    <>
      <PartList path={topic} />
      <section className="my-2">{children}</section>
    </>
  );
}
