"use client";

import useSearchAction from "@/hooks/useSearchAction";
import { ColumnWrapper, RowWrapper } from "@/ui/FlexWrapper";
import { Products } from "@/utils/part";

export function SearchBar({ q, part }: { q?: string; part?: Products }) {
  const [input, result, pending, onChange, onBlur, onEnter] =
    useSearchAction(part);

  return (
    <ColumnWrapper className="rounded-2xl border-2 py-1">
      <RowWrapper className="px-4">
        <input
          ref={input}
          defaultValue={q}
          type="text"
          placeholder="Search"
          className=" focus:outline-none w-full bg-transparent"
          onFocus={onChange}
          onBlur={onBlur}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key == "Enter") onEnter();
          }}
        />
        <button type="button" onClick={onEnter}>
          Search
        </button>
      </RowWrapper>

      <ColumnWrapper className="empty:hidden">
        {pending && <p>Searching...</p>}
        {result.map((value) => {
          return (
            <a
              href={`/part/${value.part}/${value.id}`}
              key={`search-${value.id}`}
              className="px-4 py-1 rounded-xl hover:bg-line dark:hover:text-background"
            >
              {value.name}
            </a>
          );
        })}
      </ColumnWrapper>
    </ColumnWrapper>
  );
}
