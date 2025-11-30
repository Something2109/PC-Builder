import { Products } from "@/utils/part";
import { notFound } from "next/navigation";

export default async function BuildSummaryLayout({
  params,
  children,
}: {
  params: Promise<{ product: Products }>;
  children: React.ReactNode;
}) {
  const { product } = await params;

  if (!Object.values(Products).includes(product)) return notFound();

  return children;
}
