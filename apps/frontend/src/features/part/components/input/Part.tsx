"use client";

import Part, { Products } from "@pc-builder/shared/part";
import { startTransition, useState } from "react";

import usePartAction from "@/features/part/hooks/PartAction";
import { NotificationBar } from "@/ui/NotificationBar";

import BrandSelect from "./BrandSelect";
import SeriesSelect from "./SeriesSelect";

export default function PartForm({
  path,
  defaultValue,
  setImageUrl,
}: Readonly<{
  path: string;
  part?: Products;
  defaultValue?: Part.DTO;
  setImageUrl?: (url: string) => void;
}>) {
  const [formValue, save, pending, error, setError] = usePartAction(path, defaultValue);

  const { name, brand, series, code_name, url, launch_date } = formValue ?? {};

  const brandValue = brand ?? "";
  const [prevBrand, setPrevBrand] = useState(brandValue);
  const [selectedBrand, setSelectedBrand] = useState(brandValue);

  if (brandValue !== prevBrand) {
    setPrevBrand(brandValue);
    setSelectedBrand(brandValue);
  }

  // Form fields formatted beautifully
  const formattedLaunchDate = launch_date
    ? new Date(launch_date).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  return (
    <form action={save} className="space-y-6">
      {/* Product Name (Full Width) */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-bold text-text/70 block">
          Product Name
        </label>
        <textarea
          id="name"
          name="name"
          placeholder="e.g. Intel Core i9-14900K"
          className="w-full bg-background/40 dark:bg-background/10 border border-border/70 rounded-xl px-4 py-3 text-lg font-bold text-text focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20 transition-all duration-200 resize-none min-h-15"
          defaultValue={name ?? undefined}
          required
        />
      </div>

      {/* 2-Column Grid for specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BrandSelect defaultValue={brand ?? ""} onChange={setSelectedBrand} />
        <SeriesSelect brand={selectedBrand} defaultValue={series ?? ""} />

        <div className="space-y-2">
          <label htmlFor="code_name" className="text-sm font-bold text-text/70 block">
            Code Name
          </label>
          <input
            type="text"
            id="code_name"
            name="code_name"
            placeholder="e.g. Raptor Lake"
            className="w-full bg-background/40 dark:bg-background/10 border border-border/70 rounded-xl px-4 py-2.5 text-text focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20 transition-all duration-200"
            defaultValue={code_name ?? undefined}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="launch_date" className="text-sm font-bold text-text/70 block">
            Launch Date
          </label>
          <input
            type="date"
            id="launch_date"
            name="launch_date"
            className="w-full bg-background/40 dark:bg-background/10 border border-border/70 rounded-xl px-4 py-2.5 text-text focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20 transition-all duration-200"
            defaultValue={formattedLaunchDate}
          />
        </div>
      </div>

      {/* External Link & Image URL (Full Width) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="url" className="text-sm font-bold text-text/70 block">
            Brand Product URL
          </label>
          <input
            type="url"
            id="url"
            name="url"
            placeholder="https://..."
            className="w-full bg-background/40 dark:bg-background/10 border border-border/70 rounded-xl px-4 py-2.5 text-text focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20 transition-all duration-200"
            defaultValue={url ?? undefined}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="image_url" className="text-sm font-bold text-text/70 block">
            Image URL
          </label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            placeholder="https://..."
            className="w-full bg-background/40 dark:bg-background/10 border border-border/70 rounded-xl px-4 py-2.5 text-text focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20 transition-all duration-200"
            defaultValue={defaultValue?.image_url ?? undefined}
            onChange={(e) => setImageUrl?.(e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-auto">
          {!pending && formValue && (
            <button
              type="button"
              onClick={() => {
                if (confirm("Are you sure you want to delete this part?")) {
                  startTransition(() => save(null));
                }
              }}
              className="w-full sm:w-auto px-6 py-2.5 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-xl font-semibold transition-all duration-200 shadow-sm"
            >
              Delete Part
            </button>
          )}
        </div>

        <div className="flex gap-3 w-full sm:w-auto justify-end">
          {defaultValue?.url && (
            <a
              href={defaultValue.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 border border-border/80 text-text/80 hover:text-text hover:bg-slate-500/5 rounded-xl font-semibold text-center transition-all duration-200"
            >
              Visit Brand Page
            </a>
          )}
          <button
            type="submit"
            disabled={pending}
            className="px-8 py-2.5 bg-linear-to-r from-accent-indigo to-accent-indigo/90 hover:from-accent-indigo/90 hover:to-accent-indigo text-white rounded-xl font-bold shadow-lg shadow-accent-indigo/20 hover:shadow-accent-indigo/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {pending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4">
          <NotificationBar message={error} remove={() => setError(null)} alert />
        </div>
      )}
    </form>
  );
}
