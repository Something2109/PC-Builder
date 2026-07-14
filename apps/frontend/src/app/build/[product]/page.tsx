"use client";

import useProductSummary from "@/features/build/hooks/ProductSummary";
import { useBuildContext } from "@/features/build/hooks/BuildContext";
import SummaryTable from "@/features/part/components/Summary";
import { FilterBar } from "@/features/part/components/Filter";
import Part, { Product } from "@pc-builder/shared/part";
import { use, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingPanel from "@/ui/LoadingPanel";
import ErrorPanel from "@/ui/ErrorPanel";
import { ColumnDef } from "@tanstack/react-table";
import { TablePagination } from "@/components/ui/Table";

export default function BuildProductSummary({
  params: productParams,
}: {
  params: Promise<{ product: Product.Name }>;
}) {
  const router = useRouter();
  const { product } = use(productParams);
  const { details, add: addDetails } = useBuildContext();
  const { loading, data, params, page, includeBuild, setParams, setPage, setIncludeBuild } =
    useProductSummary(product);

  const add = useCallback(
    (defaultValue: Part.Summary) => {
      addDetails(defaultValue);
      router.push("/build");
    },
    [router, addDetails]
  );

  if (loading)
    return <LoadingPanel className="h-[70vh]" text={`Loading ${Product.Label[product]}s`} />;

  if (!data)
    return (
      <ErrorPanel
        className="h-[70vh]"
        text={`Cannot find any ${Product.Label[product]} right now...`}
        reset={() => {}}
      />
    );

  const addable = !details[product] || Array.isArray(details[product]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const selectColumn: (cols: ColumnDef<Part.Summary>[]) => ColumnDef<Part.Summary>[] = useCallback(
    (cols) => {
      return [
        {
          id: "select-action",
          header: () => "",
          cell: ({ row }) => {
            const defaultValue = row.original;
            if (!defaultValue || !addable) return null;
            return (
              <button
                type="button"
                onClick={() => add(defaultValue)}
                className="px-4 py-2 text-xs font-bold text-white bg-accent-indigo hover:bg-accent-indigo/90 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                Select
              </button>
            );
          },
          meta: {
            className: "p-3 text-right",
          },
        },
        ...cols,
      ];
    },
    [add, addable]
  );

  return (
    <div className="w-full space-y-6">
      {/* Breadcrumbs / Header */}
      <div className="border-b border-border pb-5">
        <Link
          href="/build"
          className="text-xs font-bold text-accent-indigo hover:text-accent-indigo/80 flex items-center gap-1 mb-2 transition-colors uppercase tracking-wider"
        >
          &larr; Back to Build Planner
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-text" id="list">
          Select {Product.Label[product]}
        </h1>
        <p className="text-sm text-text/60 mt-1">
          Showing {data.total} compatible components based on your search and filters.
        </p>
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
              <FilterBar
                action={(formData: FormData) => setParams(formData)}
                className="w-full"
                part={product}
                context={params}
              />
            </div>
          </details>

          {/* Desktop Static Sidebar Filters */}
          <div className="hidden lg:block border border-border rounded-2xl bg-card p-5 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-text border-b border-border/60 pb-3">Filters</h2>
            <FilterBar
              action={(formData: FormData) => setParams(formData)}
              className="w-full"
              part={product}
              context={params}
            />
          </div>
        </div>

        {/* Main Content Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Control Bar (Toggle switch only) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-6">
              {/* Custom Switch Toggle */}
              <label className="flex items-center gap-3 cursor-pointer group select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    onChange={() => setIncludeBuild(!includeBuild)}
                    checked={includeBuild}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-mint" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-text group-hover:text-accent-indigo transition-colors">
                    Compatible Parts Only
                  </span>
                  <span className="text-[10px] text-text/50">
                    Hide components that violate compatibility rules
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Product Table */}
          <div className="border border-border rounded-2xl overflow-x-auto bg-card shadow-sm">
            <SummaryTable part={product} data={data.list} columns={selectColumn} />
          </div>

          {/* Pagination */}
          <TablePagination
            total={data.total}
            page={page}
            totalPages={Math.ceil(data.total / Number(process.env.PageSize))}
            onPageChange={setPage}
            entryLabel={`${Product.Label[product].toLowerCase()}s`}
          />
        </div>
      </div>
    </div>
  );
}
