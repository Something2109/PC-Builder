import Link from "next/link";
import React from "react";

interface EmptyStateProps {
  icon?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  showAction?: boolean;
}

export function EmptyState({
  icon = "📖",
  title = "There are no articles in this topic yet",
  description = "Please come back later or contribute a new article.",
  actionLabel = "Write the first article",
  actionHref,
  showAction = false,
}: EmptyStateProps) {
  return (
    <div className="py-24 text-center rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
      <span className="text-5xl">{icon}</span>
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mt-4">
        {title}
      </h3>
      <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
        {description}
      </p>
      {showAction && actionHref && (
        <Link
          href={actionHref}
          className="inline-block mt-4 text-xs font-bold text-blue-600 hover:underline"
        >
          {actionLabel} &rarr;
        </Link>
      )}
    </div>
  );
}
