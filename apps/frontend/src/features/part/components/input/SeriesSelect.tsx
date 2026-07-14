"use client";

import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";

import { mergeClass } from "@/components/ui/mergeClass";
import axiosInstance from "@/lib/axios";
import { DropdownWrapper } from "@/ui/Input";

interface Brand {
  id: number;
  name: string;
}

interface Series {
  id: number;
  name: string;
  brandId: number;
}

interface SeriesSelectProps {
  brand?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export default function SeriesSelect({
  brand = "",
  defaultValue = "",
  onChange,
}: Readonly<SeriesSelectProps>) {
  const normalizedDefaultValue = defaultValue ?? "";
  const [prevDefaultValue, setPrevDefaultValue] = useState(normalizedDefaultValue);
  const [value, setValue] = useState(normalizedDefaultValue);

  if (normalizedDefaultValue !== prevDefaultValue) {
    setPrevDefaultValue(normalizedDefaultValue);
    setValue(normalizedDefaultValue);
  }

  const normalizedBrand = brand ?? "";
  const [prevBrand, setPrevBrand] = useState(normalizedBrand);
  if (normalizedBrand !== prevBrand) {
    setPrevBrand(normalizedBrand);
    if (!normalizedBrand) {
      setValue("");
    }
  }

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all brands once using TanStack Query (shared key ["brands"])
  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Brand[]>("/brand", {
        params: { limit: 250 },
      });
      return data;
    },
  });

  // Compute selectedBrandId dynamically during render
  const selectedBrandId =
    brand && brands.length > 0
      ? (brands.find((b) => b.name.toLowerCase() === brand.trim().toLowerCase())?.id ?? null)
      : null;

  // Fetch series using TanStack Query based on selectedBrandId
  const { data: seriesList = [] } = useQuery<Series[]>({
    queryKey: ["series", selectedBrandId],
    queryFn: async () => {
      if (selectedBrandId === null) return [];
      const { data } = await axiosInstance.get<Series[]>("/series", {
        params: { brandId: selectedBrandId, limit: 250 },
      });
      return data;
    },
    enabled: selectedBrandId !== null,
  });

  const effectiveSeriesList = selectedBrandId === null ? [] : seriesList;

  // Filter series based on user typing
  const filteredSeries = effectiveSeriesList.filter((series) =>
    series.name.toLowerCase().includes(value.toLowerCase())
  );

  const showCustomOption =
    value.trim() !== "" &&
    !filteredSeries.some((s) => s.name.toLowerCase() === value.trim().toLowerCase());

  const handleSelect = (name: string) => {
    setValue(name);
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (onChange) {
      onChange(name);
    }
  };

  const handleClear = () => {
    setValue("");
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (onChange) {
      onChange("");
    }
    inputRef.current?.focus();
  };

  return (
    <DropdownWrapper
      label="Series"
      labelHtmlFor="series"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      trigger={
        <>
          <input
            ref={inputRef}
            type="text"
            id="series"
            name="series"
            placeholder={brand ? "e.g. Core i9" : "Select brand first..."}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setIsOpen(true);
              setHighlightedIndex(-1);
              if (onChange) {
                onChange(e.target.value);
              }
            }}
            onFocus={() => setIsOpen(true)}
            className="w-full bg-background/40 dark:bg-background/10 border border-border/70 rounded-xl pl-4 pr-10 py-2.5 text-text focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20 transition-all duration-200"
            autoComplete="off"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text/40 hover:text-text/80 text-lg font-bold"
              aria-label="Clear series selection"
            >
              ×
            </button>
          )}
        </>
      }
    >
      {filteredSeries.map((series, idx) => {
        const isHighlighted = idx === highlightedIndex;
        return (
          <button
            key={series.id}
            type="button"
            onClick={() => handleSelect(series.name)}
            className={mergeClass(
              "w-full flex items-center px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer text-left text-sm text-text/80 transition",
              isHighlighted ? "bg-white/5 text-text border border-white/10" : undefined
            )}
          >
            <span>{series.name}</span>
          </button>
        );
      })}
      {showCustomOption && (
        <button
          type="button"
          onClick={() => handleSelect(value)}
          className={mergeClass(
            "w-full px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer text-left text-sm text-accent-indigo font-semibold transition",
            highlightedIndex === filteredSeries.length
              ? "bg-white/5 text-accent-indigo border border-white/10"
              : undefined
          )}
        >
          + Add custom series: &quot;{value}&quot;
        </button>
      )}
      {selectedBrandId === null && !value && (
        <div className="px-3 py-2 text-sm text-text/40 italic">
          {brand ? "Resolving brand..." : "Select a database brand first to see options."}
        </div>
      )}
      {selectedBrandId !== null && filteredSeries.length === 0 && !value && (
        <div className="px-3 py-2 text-sm text-text/40 italic">
          No series found for this brand. Type to add custom series.
        </div>
      )}
    </DropdownWrapper>
  );
}
