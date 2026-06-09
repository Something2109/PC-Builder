import { notFound, redirect } from "next/navigation";

import { verifyToken } from "@/features/auth/server";
import { getBackendUrl } from "@/utils/path";
import { Summary } from "@/utils/article";
import { Roles } from "@/utils/user";

export default async function PartTopicEditPage({
  params,
}: {
  params: Promise<{ topic: string; part: string }>;
}) {
  const { topic, part } = await params;

  // Protect the route first - verify role
  const user = await verifyToken();
  if (!user || (user.role !== Roles.ADMIN && user.role !== Roles.GUEST)) {
    redirect(`/auth/login?redirect=/${topic}/${part}/edit`);
  }

  // Fetch articles matching the topic and part
  const query = new URLSearchParams({ topic, part });
  const response = await fetch(
    getBackendUrl(`/api/article?${query}`),
    { cache: "no-store" },
  );

  if (!response.ok) return notFound();

  const articleSummaries = (await response.json()) as Summary[];

  if (articleSummaries.length > 0) {
    // If article(s) exist, redirect to editing the first one found
    const targetArticle = articleSummaries[0];
    redirect(`/article/${targetArticle.id}/edit`);
  } else {
    // If no article exists, redirect to creation page with pre-filled parameters
    redirect(
      `/article/new?topic=${encodeURIComponent(topic)}&part=${encodeURIComponent(part)}`,
    );
  }
}
