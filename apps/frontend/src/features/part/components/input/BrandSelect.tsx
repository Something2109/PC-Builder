"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRef, useState } from "react";

import { mergeClass } from "@/components/ui/mergeClass";
import axiosInstance from "@/lib/axios";
import { DropdownWrapper } from "@/ui/Input";

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
  const normalizedDefaultValue = defaultValue ?? "";
  const [prevDefaultValue, setPrevDefaultValue] = useState(normalizedDefaultValue);
  const [value, setValue] = useState(normalizedDefaultValue);

  if (normalizedDefaultValue !== prevDefaultValue) {
    setPrevDefaultValue(normalizedDefaultValue);
    setValue(normalizedDefaultValue);
  }

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);

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

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(value.toLowerCase())
  );

  const showCustomOption =
    value.trim() !== "" &&
    !filteredBrands.some((b) => b.name.toLowerCase() === value.trim().toLowerCase());

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
      label="Brand"
      labelHtmlFor="brand"
      isOpen={isOpen && (filteredBrands.length > 0 || showCustomOption)}
      onClose={() => setIsOpen(false)}
      trigger={
        <>
          <input
            ref={inputRef}
            type="text"
            id="brand"
            name="brand"
            placeholder="e.g. Intel"
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
              aria-label="Clear brand selection"
            >
              ×
            </button>
          )}
        </>
      }
    >
      {filteredBrands.map((brand, idx) => {
        const isHighlighted = idx === highlightedIndex;
        return (
          <button
            key={brand.id}
            type="button"
            onClick={() => handleSelect(brand.name)}
            className={mergeClass(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer text-left text-sm text-text/80 transition",
              isHighlighted ? "bg-white/5 text-text border border-white/10" : undefined
            )}
          >
            {brand.logo_url ? (
              <Image
                src={brand.logo_url}
                alt={brand.name}
                className="w-5 h-5 object-contain rounded"
              />
            ) : (
              <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded text-[10px] font-bold">
                {brand.name[0]}
              </span>
            )}
            <span>{brand.name}</span>
          </button>
        );
      })}
      {showCustomOption && (
        <button
          type="button"
          onClick={() => handleSelect(value)}
          className={mergeClass(
            "w-full px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer text-left text-sm text-accent-indigo font-semibold transition",
            highlightedIndex === filteredBrands.length
              ? "bg-white/5 text-accent-indigo border border-white/10"
              : undefined
          )}
        >
          + Add custom brand: &quot;{value}&quot;
        </button>
      )}
    </DropdownWrapper>
  );
}
