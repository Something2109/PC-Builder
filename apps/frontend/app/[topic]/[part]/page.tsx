import { Summary } from "@/utils/article";
import { Products } from "@/utils/part";
import { Label } from "@/utils/part/product";
import { notFound } from "next/navigation";
import React from "react";
import { ArticleLink } from "@/features/article";
import { verifyToken } from "@/features/auth/server";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function PartTopicPage({
  params,
}: {
  params: Promise<{ topic: string; part: Products }>;
}) {
  const { topic, part } = await params;

  // Validate that the part is a valid product type
  if (!Object.values(Products).includes(part as Products)) {
    return notFound();
  }

  const query = new URLSearchParams({ topic, part });
  const response = await fetch(
    `${process.env.BACKEND_HOST}/api/article?${query}`,
    { cache: "no-store" },
  );

  if (!response.ok) return notFound();

  const articleSummaries = (await response.json()) as Summary[];

  // Verify token for admin user checks
  const user = await verifyToken();
  const hasLoggedIn = user;

  return (
    <div className="w-full max-w-6xl mx-auto my-6 px-4">
      {/* Dynamic Visual Banner */}
      <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 p-8 md:p-12 text-white shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-60" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full w-fit">
              <span>{topic}</span>
              <span>/</span>
              <span>{part}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight font-sans capitalize">
              {Label[part]}&apos;s {topic}
            </h1>
            <p className="text-sm md:text-base text-blue-100 font-serif max-w-xl mt-3 leading-relaxed">
              A compilation of {topic} articles providing instructions on
              assembling, configuring, and optimizing for the {Label[part]}.
            </p>
          </div>

          {hasLoggedIn && (
            <Link
              href={`/article/new?topic=${encodeURIComponent(topic)}&part=${encodeURIComponent(part)}`}
              className="shrink-0 bg-white hover:bg-slate-100 text-indigo-600 hover:text-indigo-700 font-bold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Write an Article
            </Link>
          )}
        </div>
      </div>

      {/* Grid List */}
      {articleSummaries.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {articleSummaries.map((summary) => (
            <ArticleLink key={summary.id} summary={summary} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`There isn't any article about ${Label[part]} under ${topic} yet.`}
          description="Please come back later or contribute a new article."
          actionLabel="Write your first article."
          showAction={!!hasLoggedIn}
          actionHref={`/article/new?topic=${encodeURIComponent(topic)}&part=${encodeURIComponent(part)}`}
        />
      )}
    </div>
  );
}
