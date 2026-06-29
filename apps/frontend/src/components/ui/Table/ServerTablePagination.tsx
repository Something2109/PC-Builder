"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { TablePagination } from "./TablePagination";

interface ServerTablePaginationProps {
  total: number;
  page: number;
  totalPages: number;
  path: string;
  entryLabel?: string;
}

export function ServerTablePagination({
  total,
  page,
  totalPages,
  path,
  entryLabel,
}: ServerTablePaginationProps) {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    // Determine the query parameter separator
    const separator = path.includes("?") ? "&" : "?";
    router.push(`${path}${separator}page=${newPage}`);
  };

  return (
    <TablePagination
      total={total}
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      entryLabel={entryLabel}
    />
  );
}
