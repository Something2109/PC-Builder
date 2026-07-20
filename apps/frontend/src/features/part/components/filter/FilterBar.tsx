"use client";

import { Products } from "@pc-builder/shared/part";
import { useRouter } from "next/navigation";
import { lazy, FormHTMLAttributes, LazyExoticComponent, FunctionComponent, Suspense } from "react";

import { Button } from "@/ui/Button";
import { LoadingSpinner } from "@/ui/Feedback/LoadingSpinner";
import { Input } from "@/ui/Input";

import PartFilter from "./Part";

const FilterComponents: {
  [key in Products]: LazyExoticComponent<
    FunctionComponent<{ product: Products; context: URLSearchParams }>
  >;
} = {
  [Products.CPU]: lazy(() => import("@/features/part/components/filter/CPU")),
  [Products.GPU]: lazy(() => import("@/features/part/components/filter/GPU")),
  [Products.GRAPHIC_CARD]: lazy(() => import("@/features/part/components/filter/GraphicCard")),
  [Products.MAIN]: lazy(() => import("@/features/part/components/filter/Mainboard")),
  [Products.RAM]: lazy(() => import("@/features/part/components/filter/RAM")),
  [Products.HDD]: lazy(() => import("@/features/part/components/filter/HDD")),
  [Products.PSU]: lazy(() => import("@/features/part/components/filter/PSU")),
  [Products.CASE]: lazy(() => import("@/features/part/components/filter/Case")),
  [Products.COOLER]: lazy(() => import("@/features/part/components/filter/Cooler")),
  [Products.AIO]: lazy(() => import("@/features/part/components/filter/AIO")),
  [Products.FAN]: lazy(() => import("@/features/part/components/filter/Fan")),
  [Products.SSD]: lazy(() => import("@/features/part/components/filter/SSD")),
  [Products.CPU_BLOCK]: lazy(() => import("@/features/part/components/filter/CPUBlock")),
  [Products.PUMP]: lazy(() => import("@/features/part/components/filter/Pump")),
  [Products.RADIATOR]: lazy(() => import("@/features/part/components/filter/Radiator")),
};

export function FilterBar({
  part,
  context,
  className,
  ...rest
}: {
  part: Products;
  context: URLSearchParams;
} & FormHTMLAttributes<HTMLFormElement>) {
  const router = useRouter();

  if (!FilterComponents[part]) return;

  const Component = FilterComponents[part];
  const options = new URLSearchParams(context);

  const defaultAction = (formData: FormData) => {
    const searchParams = new URLSearchParams();

    formData.forEach((value, key) => {
      if (typeof value === "string" && value.trim() !== "") {
        searchParams.append(key, value);
      }
    });

    router.push(`/part/${part}?${searchParams.toString()}`);
  };

  const actionHandler = rest.action ?? (rest.onSubmit ? undefined : defaultAction);

  return (
    <form className={`flex flex-col gap-5 ${className}`} action={actionHandler} {...rest}>
      <div className="flex flex-col gap-4">
        {/* Search input field */}
        <div className="w-full flex items-center gap-2 px-3 py-2 border border-border rounded-xl bg-slate-50/5 focus-within:border-accent-indigo focus-within:ring-1 focus-within:ring-accent-indigo transition-all">
          <svg
            className="w-4 h-4 text-text/40 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Input
            className="focus:outline-none bg-transparent text-sm w-full"
            name="q"
            defaultValue={options.get("q") || ""}
            placeholder="Search parts..."
          />
        </div>

        {/* Filters wrapping and stacking container */}
        <div className="flex flex-wrap gap-2.5">
          <PartFilter product={part} context={options} />
          <Suspense fallback={<LoadingSpinner text="loading filter options..." />}>
            <Component product={part} context={options} />
          </Suspense>
        </div>
      </div>

      <hr className="border-border/60" />

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          type="reset"
          onClick={() => router.replace(`/part/${part}`)}
          className="flex-1 py-2 text-xs"
        >
          Reset
        </Button>
        <Button
          type="submit"
          className="flex-1 py-2 text-xs font-semibold text-white bg-accent-indigo hover:bg-accent-indigo/90 border-accent-indigo hover:border-accent-indigo/90 shadow-sm"
        >
          Filter
        </Button>
      </div>
    </form>
  );
}
