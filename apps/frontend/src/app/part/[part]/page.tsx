import { Product } from "@pc-builder/shared/part";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ServerTablePagination } from "@/components/ui/Table";
import { FilterBar } from "@/features/part/components/filter/FilterBar";
import SummaryTable from "@/features/part/components/summary/SummaryTable";
import { getBackendUrl } from "@/utils/api";

export default async function PartListPage({
  params,
  searchParams,
}: {
  params: Promise<{ part: Product.Name }>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { part } = await params;
  const { part: _, ...query } = await searchParams;

  const queryEntries = Object.entries(query).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => acc.push([key, v]));
      return acc;
    }

    acc.push([key, value]);
    return acc;
  }, [] as string[][]);
  const options = new URLSearchParams(queryEntries);

  const response = await fetch(getBackendUrl(`/api/part/${part}?${options}`));
  if (!response.ok) return notFound();

  const data = await response.json();

  const page = options.get("page") ?? "1";
  const limit = options.get("limit") ?? process.env.PageSize ?? "10";
  options.delete("page");
  options.delete("limit");

  return (
    <div className="w-full space-y-6">
      {/* Header / Navigation */}
      <div className="border-b border-border pb-5">
        <Link
          href="/part"
          className="text-xs font-bold text-accent-indigo hover:text-accent-indigo/80 flex items-center gap-1 mb-2 transition-colors uppercase tracking-wider"
        >
          &larr; Back to Hardware Directory
        </Link>
        <div className="flex items-center justify-between flex-wrap gap-4 mt-1">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text">
              {Product.Label[part]} Directory
            </h1>
            <p className="text-sm text-text/60 mt-1">
              Explore specifications, brands, and compatibility metrics for all{" "}
              {Product.Label[part].toLowerCase()} models.
            </p>
          </div>
          <Link
            href={`/part/${part}/new`}
            className="px-4 py-2.5 text-xs font-bold text-white bg-accent-indigo hover:bg-accent-indigo/90 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            + Add New {Product.Label[part]}
          </Link>
        </div>
      </div>

      {/* Grid Layout for Sidebar + Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Column: Filters */}
        <div className="lg:col-span-1 space-y-4">
          {/* Mobile Collapsible Filters */}
          <details className="lg:hidden border border-border rounded-2xl bg-card p-4 shadow-sm group">
            <summary className="flex items-center justify-between cursor-pointer list-none select-none">
              <h2 className="text-base font-bold text-text">Filters</h2>
              <span className="text-text/60 font-bold transition-transform duration-200 group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div className="mt-4 pt-4 border-t border-border/60">
              <FilterBar className="w-full" part={part} context={options} />
            </div>
          </details>

          {/* Desktop Static Sidebar Filters */}
          <div className="hidden lg:block border border-border rounded-2xl bg-card p-5 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-text border-b border-border/60 pb-3">Filters</h2>
            <FilterBar className="w-full" part={part} context={options} />
          </div>
        </div>

        {/* Main Content Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Summary Bar */}
          <div className="flex justify-between items-center p-4 rounded-2xl border border-border bg-card shadow-sm">
            <span className="text-sm font-semibold text-text/50">
              Showing {data.total} item{data.total !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Part List Table */}
          <div className="border border-border rounded-2xl overflow-x-auto bg-card shadow-sm">
            <SummaryTable part={part} data={data.list} />
          </div>

          {/* Pagination */}
          <ServerTablePagination
            path={`/part/${part}?${options.toString()}`}
            page={Number(page)}
            pageSize={Number(limit)}
            total={data.total}
            totalPages={Math.ceil(data.total / Number(limit))}
            entryLabel="items"
          />
        </div>
      </div>
    </div>
  );
}
