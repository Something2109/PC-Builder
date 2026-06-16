"use client";
 

import Link from "next/link";
import React from "react";

import { Guard } from "@/features/auth";
import { ColumnWrapper, RowWrapper } from "@/ui/FlexWrapper";
import { mergeClass } from "@/ui/mergeClass";
import { Summary } from "@/utils/article";
import { Roles } from "@/utils/user";

const max_char = 180;

function ArticleLink({
  className,
  summary,
  ...rest
}: Omit<Parameters<typeof Link>[0], "href"> & { summary: Summary }) {
  const href = `/article/${summary.slug || summary.id}`;

  const formattedDate = new Date(summary.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <Link
      href={href}
      className={mergeClass(
        "group flex flex-col md:flex-row gap-5 p-4 border border-slate-100 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900/30 hover:border-blue-500/50 hover:bg-blue-50/10 dark:hover:bg-blue-950/5 hover:shadow-lg dark:hover:shadow-blue-950/20 transition-all duration-300",
        className,
      )}
      {...rest}
    >
      {/* Thumbnail Container */}
      <div className="relative w-full md:w-48 lg:w-56 shrink-0 aspect-video md:aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800/50">
        {summary.cover ? (
          <img
            src={summary.cover}
            alt={summary.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-tr from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
            <span className="text-[10px] text-slate-700 dark:text-slate-600 font-mono tracking-wider select-none">
              PC BUILDER
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/5" />

        {/* Small Emoji Overlay */}
        {summary.icon && (
          <div className="absolute bottom-2 left-2 flex items-center justify-center text-2xl bg-white dark:bg-slate-900 rounded-lg w-9 h-9 shadow-md border border-slate-100 dark:border-slate-800 select-none group-hover:scale-110 transition-transform">
            {summary.icon}
          </div>
        )}

        {/* Floating status badge for Admins */}
        {summary.status !== "published" && (
          <Guard roles={[Roles.ADMIN, Roles.GUEST]}>
            <span
              className={mergeClass(
                "absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider",
                summary.status === "draft"
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-red-500 text-white border-red-500",
              )}
            >
              {summary.status}
            </span>
          </Guard>
        )}
      </div>

      {/* Meta Content */}
      <ColumnWrapper className="justify-between grow py-1 gap-2">
        <ColumnWrapper className="gap-2">
          {/* Tag Badges */}
          <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {summary.topic && (
              <span className="text-slate-500 dark:text-slate-400">
                {summary.topic}
              </span>
            )}
            {summary.topic && summary.part && <span>•</span>}
            {summary.part && (
              <span className="text-blue-600 dark:text-blue-400">
                {summary.part}
              </span>
            )}
          </div>

          <h2 className="font-sans text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
            {summary.title}
          </h2>

          <p className="font-serif text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
            {summary.standfirst.length > max_char
              ? `${summary.standfirst.slice(0, max_char).trim()}...`
              : summary.standfirst}
          </p>
        </ColumnWrapper>

        {/* Footer Meta Row */}
        <RowWrapper className="items-center justify-between text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/50 pt-2 mt-1">
          <div className="flex items-center gap-1.5 font-medium">
            <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center text-[10px] font-bold select-none border border-slate-200 dark:border-slate-700">
              {summary.author.slice(0, 2).toUpperCase()}
            </div>
            <span>{summary.author}</span>
          </div>

          <div className="flex items-center gap-3">
            <span>{formattedDate}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3.5 h-3.5 opacity-60"
              >
                <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                <path
                  fillRule="evenodd"
                  d="M.664 9.576a12.124 12.124 0 0118.672 0 1.218 1.218 0 010 1.348 12.124 12.124 0 01-18.672 0 1.218 1.218 0 010-1.348zM8 10a2 2 0 114 0 2 2 0 01-4 0z"
                  clipRule="evenodd"
                />
              </svg>
              {summary.views || 0}
            </span>
          </div>
        </RowWrapper>
      </ColumnWrapper>
    </Link>
  );
}

export { ArticleLink };
