"use client";

import Link from "next/link";

import useSearchAction from "@/hooks/useSearchAction";
import { Products } from "@/utils/part";

export function SearchBar({ q, part }: { q?: string; part?: Products }) {
  const [input, result, pending, onChange, onBlur, onEnter] = useSearchAction(part);

  return (
    <div className="relative w-full">
      <div className="flex flex-row items-center border border-border bg-card rounded-2xl px-4 py-3 gap-3 transition-all duration-300 focus-within:border-accent-indigo focus-within:ring-2 focus-within:ring-accent-indigo/20 shadow-lg">
        {/* Search Icon SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="size-5 text-text/40"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21-21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>

        <input
          ref={input}
          defaultValue={q}
          type="text"
          placeholder="Search components (e.g. RTX 4070, Ryzen 7)..."
          className="focus:outline-none w-full bg-transparent text-text placeholder-text/40 text-base"
          onFocus={onChange}
          onBlur={onBlur}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") onEnter();
          }}
        />
        <button
          type="button"
          onClick={onEnter}
          className="px-4 py-1.5 bg-accent-indigo text-white rounded-xl text-sm font-semibold hover:opacity-90 active:scale-95 transition-all duration-200 shrink-0"
        >
          Search
        </button>
      </div>

      {/* Floating Dropdown Results */}
      <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-2xl p-2 max-h-80 overflow-y-auto flex flex-col gap-1 empty:hidden">
        {pending && (
          <div className="px-4 py-3 text-sm text-text/50 flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-accent-cyan"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Searching Database...
          </div>
        )}
        {!pending &&
          result.length > 0 &&
          result.map((value) => (
            <Link
              href={`/part/${value.part}/${value.id}`}
              key={`search-${value.id}`}
              className="px-4 py-2.5 rounded-xl text-sm text-text/80 hover:bg-accent-indigo/10 hover:text-accent-indigo hover:translate-x-1 transition-all duration-200"
            >
              {value.name}
            </Link>
          ))}
      </div>
    </div>
  );
}
