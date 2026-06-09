import { Products } from "@/utils/part";
import { notFound } from "next/navigation";

export default async function BuildSummaryLayout({
  params,
  children,
}: {
  params: Promise<{ product: string }>;
  children: React.ReactNode;
}) {
  const { product } = await params;

  if (!Object.values(Products).includes(product as Products)) return notFound();

  return children;
}
