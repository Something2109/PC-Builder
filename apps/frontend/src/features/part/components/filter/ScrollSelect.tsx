"use client";

import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Products } from "@pc-builder/shared/part";
import { useClickOutside } from "@/hooks/useClickOutside";
import axiosInstance from "@/lib/axios";
import { useDebounce } from "@/hooks/useDebounce";

interface Option {
  id: number;
  name: string;
}

type SelectOption = Option | string;

// Resolves names for initial selected IDs
function useResolvedNames(attribute: string, defaultValue: string[]) {
  const [selectedNames, setSelectedNames] = useState<Map<string, string>>(() => {
    const initialMap = new Map<string, string>();
    if (defaultValue && defaultValue.length > 0 && attribute !== "brand" && attribute !== "series") {
      defaultValue.forEach((id) => initialMap.set(String(id), String(id)));
    }
    return initialMap;
  });

  useEffect(() => {
    if (attribute === "brand" || attribute === "series") {
      if (defaultValue && defaultValue.length > 0) {
        defaultValue.forEach(async (id) => {
          if (selectedNames.has(String(id))) return;
          try {
            const { data } = await axiosInstance.get(`/${attribute}/${id}`);
            setSelectedNames((prev) => {
              const next = new Map(prev);
              next.set(String(id), data.name);
              return next;
            });
          } catch (e) {
            console.error("Failed to fetch initial ID name:", id, e);
          }
        });
      }
    }
  }, [defaultValue, attribute, selectedNames]);

  return { selectedNames, setSelectedNames };
}

// Fetches options with TanStack Infinite Query & Debounces search input
function useInfiniteSelectQuery(
  product: Products,
  attribute: string,
  context: URLSearchParams,
  searchQuery: string
) {
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const query = useInfiniteQuery({
    queryKey: ["partFilterInfinite", product, attribute, context.toString(), debouncedSearchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams(context);
      params.delete(attribute);
      params.set("page", String(pageParam));
      params.set("limit", "20");
      if (debouncedSearchQuery) {
        params.set("filter_q", debouncedSearchQuery);
      }

      const { data: resData } = await axiosInstance.get(
        `/part/filter/${product}/${attribute}`,
        { params }
      );
      return (resData[attribute] || []) as SelectOption[];
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length >= 20 ? allPages.length + 1 : undefined;
    },
  });

  const options = query.data ? query.data.pages.flat() : [];

  return {
    options,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
  };
}

interface ScrollSelectPanelProps {
  product: Products;
  attribute: string;
  context: URLSearchParams;
  selectedIds: string[];
  toggleOption: (id: string, optName: string) => void;
}

// Dropdown Popover Sub-Component
function ScrollSelectPanel({
  product,
  attribute,
  context,
  selectedIds,
  toggleOption,
}: Readonly<ScrollSelectPanelProps>) {
  const [searchQuery, setSearchQuery] = useState("");

  const { options, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteSelectQuery(product, attribute, context, searchQuery);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 30) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  return (
    <div className="absolute left-0 right-0 z-50 mt-2 bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
      {/* Search bar */}
      <div className="p-3 border-b border-white/5 flex items-center gap-2 bg-white/5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 text-text/40"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border-none text-sm text-text placeholder-text/40 focus:outline-none focus:ring-0 p-0"
          autoFocus
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-text/40 hover:text-text/80 text-xs p-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Options List */}
      <div
        onScroll={handleScroll}
        className="max-h-60 overflow-y-auto p-2 space-y-1 custom-scrollbar"
      >
        {isLoading && options.length === 0 ? (
          <div className="py-8 text-center text-sm text-text/40">Loading options...</div>
        ) : options.length === 0 ? (
          <div className="py-8 text-center text-sm text-text/40">No options found</div>
        ) : (
          options.map((option) => {
            const optId = typeof option === "object" && option !== null ? (option as unknown as Option).id : option;
            const optIdStr = String(optId);
            const optName = typeof option === "object" && option !== null ? (option as unknown as Option).name : option;
            const isChecked = selectedIds.includes(optIdStr);
            return (
              <label
                key={optIdStr}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer text-sm text-text/80 transition"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleOption(optIdStr, String(optName))}
                  className="rounded border-white/10 bg-transparent text-primary focus:ring-primary focus:ring-offset-background"
                />
                <span className="truncate">{String(optName)}</span>
              </label>
            );
          })
        )}

        {isFetchingNextPage && (
          <div className="py-2 text-center text-xs text-text/40 flex items-center justify-center gap-2">
            <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            Loading more...
          </div>
        )}
      </div>
    </div>
  );
}

interface ScrollSelectProps {
  name: string;
  product: Products;
  attribute: string;
  context: URLSearchParams;
  defaultValue?: string[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
}

export default function ScrollSelect({
  name,
  product,
  attribute,
  context,
  defaultValue = [],
  value,
  onChange,
  placeholder,
}: Readonly<ScrollSelectProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(defaultValue);

  const selectedIds = value !== undefined ? value : localSelectedIds;
  const containerRef = useRef<HTMLDivElement>(null);

  // Invoke hooks
  useClickOutside(containerRef, () => setIsOpen(false));
  const { selectedNames, setSelectedNames } = useResolvedNames(attribute, defaultValue);

  const toggleOption = (id: string, optName: string) => {
    const nextSelected = selectedIds.includes(id)
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id];

    if (!selectedIds.includes(id)) {
      setSelectedNames((prev) => {
        const next = new Map(prev);
        next.set(id, optName);
        return next;
      });
    }

    if (onChange) {
      onChange(nextSelected);
    } else {
      setLocalSelectedIds(nextSelected);
    }
  };

  const getButtonText = () => {
    if (selectedIds.length === 0) {
      return placeholder ?? `Select ${attribute}`;
    }
    const names = selectedIds.map((id) => selectedNames.get(id) || `ID: ${id}`);
    return names.join(", ");
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Hidden inputs to expose ID value for form submission (uncontrolled) */}
      {selectedIds.map((id) => (
        <input key={id} type="hidden" name={name} value={id} />
      ))}

      {/* Dropdown Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left bg-background/20 backdrop-blur-md border border-white/10 hover:border-white/20 transition px-4 py-2 rounded-xl text-text flex items-center justify-between text-sm shadow-sm"
      >
        <span className="truncate pr-4">{getButtonText()}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <ScrollSelectPanel
          product={product}
          attribute={attribute}
          context={context}
          selectedIds={selectedIds}
          toggleOption={toggleOption}
        />
      )}
    </div>
  );
}
