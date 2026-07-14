"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import axiosInstance from "@/lib/axios";
import { SearchSelect } from "@/ui/Input";

interface Brand {
  id: number;
  name: string;
  logo_url: string | null;
}

interface BrandSelectProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export default function BrandSelect({ defaultValue = "", onChange }: Readonly<BrandSelectProps>) {
  // Fetch all brands from backend using TanStack Query
  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Brand[]>("/brand", {
        params: { limit: 250 },
      });
      return data;
    },
  });

  const options = brands.map((b) => ({ value: b.name, label: b.name }));

  return (
    <SearchSelect
      name="brand"
      label="Brand"
      labelHtmlFor="brand"
      defaultValue={defaultValue}
      onChange={onChange}
      placeholder="e.g. Intel"
      allowCustom
      options={options}
      renderOption={({ value, label }) => {
        const brand = brands.find((b) => b.name === value);
        return (
          <span className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-text/80 transition w-full">
            {brand?.logo_url ? (
              <Image
                src={brand.logo_url}
                alt={label}
                width={20}
                height={20}
                className="w-5 h-5 object-contain rounded"
              />
            ) : (
              <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded text-[10px] font-bold shrink-0">
                {label[0]}
              </span>
            )}
            <span>{label}</span>
          </span>
        );
      }}
    />
  );
}
