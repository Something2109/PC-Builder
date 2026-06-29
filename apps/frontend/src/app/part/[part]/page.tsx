import { Product } from "@pc-builder/shared/part";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FilterBar } from "@/features/part/components/Filter";
import SummaryTable from "@/features/part/components/Summary";
import { ToggleButton } from "@/ui/Toggle";
import { ServerTablePagination } from "@/components/ui/Table";
import { getBackendUrl } from "@/utils/path";

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

      {/* Control Bar (Filters & results count) */}
      <div className="flex justify-between items-center p-4 rounded-2xl border border-border bg-card shadow-sm">
        <span className="text-sm font-semibold text-text/50">
          Showing {data.total} item{data.total !== 1 ? "s" : ""}
        </span>
        <ToggleButton label="Filters">
          <div className="w-full mt-4 p-4 border border-border rounded-xl bg-card/50 text-left">
            <FilterBar className="w-full" part={part} context={options} />
          </div>
        </ToggleButton>
      </div>

      {/* Part List Table */}
      <div className="border border-border rounded-2xl overflow-x-scroll bg-card shadow-sm">
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
  );
}
