"use client";

import React from "react";

interface TablePaginationProps {
  total: number;
  page: number;
  totalPages: number;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  onPageChange: (page: number) => void;
  entryLabel?: string;
}

// Generate the list of pages to show (with ellipsis if total pages is large)
function getPageNumbers(current: number, total: number): (number | string)[] {
  const pages: (number | string)[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // Always show page 1
    pages.push(1);

    if (current > 3) {
      pages.push("...");
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) {
      pages.push("...");
    }

    // Always show last page
    pages.push(total);
  }

  return pages;
}

export function TablePagination({
  total,
  page,
  totalPages,
  pageSize,
  onPageSizeChange,
  onPageChange,
  entryLabel = "entries",
}: TablePaginationProps) {
  if (total === 0) return null;

  const showLimitSelect = pageSize !== undefined && onPageSizeChange !== undefined;

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center text-xs text-text/50 mt-4">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
        <div>
          Showing page <span className="text-text font-bold">{page}</span> of{" "}
          <span className="text-text font-bold">{totalPages || 1}</span> (
          <span className="text-text font-bold">{total}</span> total {entryLabel})
        </div>
        {showLimitSelect && (
          <div className="flex items-center gap-1.5">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
              }}
              className="bg-card border border-border rounded px-2.5 py-1 text-xs text-text focus:outline-none focus:border-accent-indigo transition-colors"
            >
              {[5, 10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>entries</span>
          </div>
        )}
      </div>
      <div className="flex gap-1.5 items-center select-none">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1.5 rounded bg-card border border-border hover:bg-accent-indigo/10 hover:border-accent-indigo/40 hover:text-text disabled:opacity-40 disabled:hover:bg-card disabled:hover:border-border disabled:hover:text-text/40 text-text/70 font-semibold cursor-pointer transition-all"
        >
          &larr; Prev
        </button>
        {getPageNumbers(page, totalPages).map((p, idx) => {
          if (p === "...") {
            return (
              <span key={`ell-${idx}`} className="px-1.5 text-text/30">
                ...
              </span>
            );
          }
          const isCurrent = p === page;
          return (
            <button
              key={`page-${p}`}
              type="button"
              onClick={() => onPageChange(Number(p))}
              className={`px-3.5 py-1.5 rounded border text-xs font-semibold cursor-pointer transition-all ${
                isCurrent
                  ? "bg-accent-indigo border-accent-indigo text-white font-bold"
                  : "bg-card border-border text-text/70 hover:bg-accent-indigo/10 hover:border-accent-indigo/40 hover:text-text"
              }`}
            >
              {p}
            </button>
          );
        })}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1.5 rounded bg-card border border-border hover:bg-accent-indigo/10 hover:border-accent-indigo/40 hover:text-text disabled:opacity-40 disabled:hover:bg-card disabled:hover:border-border disabled:hover:text-text/40 text-text/70 font-semibold cursor-pointer transition-all"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
