"use client";

import { Table, flexRender } from "@tanstack/react-table";
import React from "react";

interface DataTableProps<TData> {
  table: Table<TData>;
  isLoading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  className?: string;
  tableClassName?: string;
  rowClassName?: string;
}

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    className?: string;
  }
}

export function DataTable<TData>({
  table,
  isLoading,
  loadingMessage = "Loading data...",
  emptyMessage = "No records found.",
  className = "bg-slate-950/20 border border-slate-800 rounded-xl overflow-hidden",
  tableClassName = "w-full border-collapse text-left text-xs",
  rowClassName = "hover:bg-slate-800/20 transition-colors",
}: DataTableProps<TData>) {
  return (
    <div className={className}>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>{loadingMessage}</span>
        </div>
      ) : table.getRowModel().rows.length === 0 ? (
        <div className="text-center py-20 text-slate-500 italic">{emptyMessage}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className={tableClassName}>
            <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-semibold max-lg:hidden">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const className = header.column.columnDef.meta?.className ?? "px-4 py-3";
                    const isSortable = header.column.getCanSort() && header.id !== "actions";
                    return (
                      <th
                        key={header.id}
                        className={`${className} select-none ${
                          isSortable ? "cursor-pointer hover:text-white" : ""
                        }`}
                        onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
                      >
                        <div
                          className={`flex items-center gap-1 ${header.id === "actions" ? "justify-end" : ""}`}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {isSortable && (
                            <span className="text-[10px] text-slate-500 font-normal">
                              {{
                                asc: " ▲",
                                desc: " ▼",
                              }[header.column.getIsSorted() as string] ?? " ⇅"}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className={rowClassName}>
                  {row.getVisibleCells().map((cell) => {
                    const className = cell.column.columnDef.meta?.className ?? "px-4 py-3";
                    return (
                      <td key={cell.id} className={className}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
