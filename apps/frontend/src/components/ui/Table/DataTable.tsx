/* eslint-disable @typescript-eslint/no-explicit-any */
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

export function DataTable<TData>({
  table,
  isLoading,
  loadingMessage = "Loading data...",
  emptyMessage = "No records found.",
  className = "border border-border rounded-2xl overflow-hidden bg-card shadow-sm",
  tableClassName = "w-full border-collapse text-left text-xs",
  rowClassName = "hover:bg-accent-indigo/5 transition-colors border-b border-border/50",
}: DataTableProps<TData>) {
  return (
    <div className={className}>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-text/40 gap-2">
          <div className="w-6 h-6 border-2 border-accent-indigo border-t-transparent rounded-full animate-spin" />
          <span>{loadingMessage}</span>
        </div>
      ) : table.getRowModel().rows.length === 0 ? (
        <div className="text-center py-20 text-text/40 italic">
          {emptyMessage}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className={tableClassName}>
            <thead className="bg-background/40 border-b border-border text-text/50 font-bold uppercase tracking-wider">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isRawTd = (header.column.columnDef.meta as any)?.isRawTd;
                    if (isRawTd) {
                      const rendered = flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      );
                      return React.isValidElement(rendered)
                        ? React.cloneElement(rendered, { key: header.id } as any)
                        : rendered;
                    }
                    const className = (header.column.columnDef.meta as any)?.className ?? "px-4 py-3.5";
                    const isSortable = header.column.getCanSort() && header.id !== "actions";
                    return (
                      <th
                        key={header.id}
                        className={`${className} select-none ${
                          isSortable ? "cursor-pointer hover:text-text" : ""
                        }`}
                        onClick={
                          isSortable
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                      >
                        <div className={`flex items-center gap-1 ${header.id === "actions" ? "justify-end" : ""}`}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {isSortable && (
                            <span className="text-[10px] text-text/30 font-normal">
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
            <tbody className="divide-y divide-border/60 text-text/80">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className={rowClassName}>
                  {row.getVisibleCells().map((cell) => {
                    const isRawTd = (cell.column.columnDef.meta as any)?.isRawTd;
                    if (isRawTd) {
                      const rendered = flexRender(cell.column.columnDef.cell, cell.getContext());
                      return React.isValidElement(rendered)
                        ? React.cloneElement(rendered, { key: cell.id } as any)
                        : rendered;
                    }
                    const className = (cell.column.columnDef.meta as any)?.className ?? "px-4 py-3.5 align-middle";
                    return (
                      <td
                        key={cell.id}
                        className={className}
                      >
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
