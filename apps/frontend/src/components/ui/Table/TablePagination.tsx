"use client";

import { Table } from "@tanstack/react-table";
import React from "react";

interface TablePaginationProps<TData> {
  table: Table<TData>;
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  onPageChange: (page: number) => void;
  entryLabel?: string;
}

export function TablePagination<TData>({
  table,
  total,
  page,
  totalPages,
  pageSize,
  onPageSizeChange,
  onPageChange,
  entryLabel = "entries",
}: TablePaginationProps<TData>) {
  if (total === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center text-xs text-slate-400 mt-2">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
        <div>
          Showing page <span className="text-white font-bold">{page}</span> of{" "}
          <span className="text-white font-bold">{totalPages || 1}</span> (
          <span className="text-white">{total}</span> total {entryLabel})
        </div>
        <div className="flex items-center gap-1.5">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            {[5, 10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          className="px-3 py-1 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-800 disabled:hover:text-slate-400 text-white font-semibold cursor-pointer transition-all"
        >
          Prev
        </button>
        <button
          type="button"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          className="px-3 py-1 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-800 disabled:hover:text-slate-400 text-white font-semibold cursor-pointer transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
}
