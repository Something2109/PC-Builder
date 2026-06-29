"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { TablePagination } from "./TablePagination";

interface ServerTablePaginationProps {
  total: number;
  page: number;
  totalPages: number;
  path: string;
  pageSize?: number;
  entryLabel?: string;
}

export function ServerTablePagination({
  total,
  page,
  totalPages,
  path,
  pageSize,
  entryLabel,
}: ServerTablePaginationProps) {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    const [pathname, searchStr] = path.split("?");
    const searchParams = new URLSearchParams(searchStr ?? "");
    searchParams.set("page", String(newPage));
    // Carry over limit if defined
    if (pageSize !== undefined) {
      searchParams.set("limit", String(pageSize));
    }
    router.push(`${pathname}?${searchParams.toString()}`);
  };

  const handlePageSizeChange = (newSize: number) => {
    const [pathname, searchStr] = path.split("?");
    const searchParams = new URLSearchParams(searchStr ?? "");
    searchParams.set("limit", String(newSize));
    searchParams.set("page", "1"); // Reset to page 1 on limit change
    router.push(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <TablePagination
      total={total}
      page={page}
      totalPages={totalPages}
      pageSize={pageSize}
      onPageSizeChange={handlePageSizeChange}
      onPageChange={handlePageChange}
      entryLabel={entryLabel}
    />
  );
}
