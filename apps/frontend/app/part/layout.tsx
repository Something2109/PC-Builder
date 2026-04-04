import React from "react";
import { PartList } from "@/features/part";

export default function ListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PartList path="part" />
      <section className="my-2">{children}</section>
    </>
  );
}
