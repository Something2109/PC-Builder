"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import axiosInstance from "@/lib/axios";
import { SearchSelect } from "@/ui/Input";

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
  // Reset series value when brand changes
  const normalizedBrand = brand ?? "";
  const [prevBrand, setPrevBrand] = useState(normalizedBrand);
  const [seriesKey, setSeriesKey] = useState(0);

  if (normalizedBrand !== prevBrand) {
    setPrevBrand(normalizedBrand);
    setSeriesKey((k) => k + 1);
  }

  // Shared brands cache — resolves brand name → ID
  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Brand[]>("/brand", {
        params: { limit: 250 },
      });
      return data;
    },
  });

  const selectedBrandId =
    normalizedBrand && brands.length > 0
      ? (brands.find((b) => b.name.toLowerCase() === normalizedBrand.trim().toLowerCase())?.id ??
        null)
      : null;

  // Fetch series for the resolved brand ID
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

  const options = selectedBrandId !== null ? seriesList.map((s) => s.name) : [];

  const emptyMessage = !normalizedBrand
    ? "Select a brand first to see options."
    : selectedBrandId === null
      ? "Resolving brand..."
      : "No series found for this brand. Type to add a custom one.";

  return (
    <SearchSelect
      key={seriesKey}
      name="series"
      label="Series"
      labelHtmlFor="series"
      defaultValue={seriesKey === 0 ? defaultValue : ""}
      onChange={onChange}
      placeholder={normalizedBrand ? "e.g. Core i9" : "Select brand first..."}
      allowCustom={selectedBrandId !== null || !!normalizedBrand}
      options={options}
      emptyMessage={emptyMessage}
    />
  );
}
