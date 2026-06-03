import { ArticleLink } from "@/features/article";
import { Summary } from "@/utils/article";
import { notFound } from "next/navigation";
import React from "react";
import { verifyToken } from "@/features/auth/server";
import { Roles } from "@/utils/user";
import Link from "next/link";

export default async function ArticleIndexPage() {
  const response = await fetch(`${process.env.BACKEND_HOST}/api/article`, {
    cache: "no-store",
  });

  if (!response.ok) return notFound();

  const articleSummaries = (await response.json()) as Summary[];

  // Verify token for admin user checks
  const user = await verifyToken();
  const isAdmin =
    user && (user.role === Roles.ADMIN || user.role === Roles.GUEST);

  return (
    <div className="w-full max-w-6xl mx-auto my-6 px-4">
      {/* Visual Banner Header */}
      <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12 text-white shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-60" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight font-sans">
              Giới thiệu & Hướng dẫn
            </h1>
            <p className="text-sm md:text-base text-blue-100 font-serif max-w-xl mt-3 leading-relaxed">
              Khám phá các bài viết hướng dẫn build PC chuyên sâu, review phần
              cứng mới nhất và chia sẻ kinh nghiệm lắp ráp máy tính tối ưu hiệu
              năng.
            </p>
          </div>

          {isAdmin && (
            <Link
              href="/article/new"
              className="shrink-0 bg-white hover:bg-slate-100 text-blue-600 hover:text-blue-700 font-bold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Viết Bài Mới
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
        <div className="py-24 text-center rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
          <span className="text-5xl">📖</span>
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mt-4">
            Chưa có bài viết nào
          </h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            Các bài viết mới sẽ xuất hiện tại đây khi được xuất bản.
          </p>
          {isAdmin && (
            <Link
              href="/article/new"
              className="inline-block mt-4 text-xs font-bold text-blue-600 hover:underline"
            >
              Tạo bài viết đầu tiên &rarr;
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
