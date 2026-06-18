"use client";

import useProductSummary from "@/features/build/hooks/ProductSummary";
import { useBuildContext } from "@/features/build/hooks/BuildContext";
import SummaryTable from "@/features/part/components/Summary";
import { FilterBar } from "@/features/part/components/Filter";
import { ToggleButton } from "@/ui/Toggle";
import PaginationBar from "@/ui/PaginationBar";
import Part, { Product } from "@/utils/part";
import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingPanel from "@/ui/LoadingPanel";
import ErrorPanel from "@/ui/ErrorPanel";

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

  const add = (defaultValue: Part.Summary) => {
    addDetails(defaultValue);
    router.push("/build");
  };

  const AddButton = ({ defaultValue }: { defaultValue?: Part.Summary }) => {
    if (!defaultValue || !addable) return <td></td>;

    return (
      <td className="p-3 text-right">
        <button
          type="button"
          onClick={() => add(defaultValue)}
          className="px-4 py-2 text-xs font-bold text-white bg-accent-indigo hover:bg-accent-indigo/90 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          Select
        </button>
      </td>
    );
  };

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

      {/* Control Bar (Toggle switch & filter controls) */}
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
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-mint" />
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

        <div className="flex items-center gap-2">
          <ToggleButton label="Filters">
            <div className="w-full mt-4 p-4 border border-border rounded-xl bg-card/50">
              <FilterBar
                action={(formData: FormData) => setParams(formData)}
                className="w-full"
                part={product}
                context={params}
              />
            </div>
          </ToggleButton>
        </div>
      </div>

      {/* Product Table */}
      <div className="border border-border rounded-2xl overflow-x-auto bg-card shadow-sm">
        <SummaryTable part={product} data={data.list} Cells={[AddButton]} />
      </div>

      {/* Pagination */}
      <PaginationBar
        path={setPage}
        current={page}
        total={Math.ceil(data.total / Number(process.env.PageSize))}
      />
    </div>
  );
}
