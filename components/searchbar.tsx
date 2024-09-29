"use client";

import Part from "@/utils/interface/part/Parts";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { ColumnWrapper, RowWrapper } from "./utils/FlexWrapper";

export function SearchBar({ q, part }: { q?: string; part?: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState<string>("");
  const [result, setResult] = useState<Part.BasicInfo[]>([]);
  let timeout: NodeJS.Timeout | undefined = undefined;

  useEffect(() => {
    if (search.length > 0) {
      const params = new URLSearchParams();
      params.set("q", search);
      params.set("page", "1");
      params.set("limit", "5");
      if (part) {
        params.set("part", part);
      }

      fetch(`/api/search?${params.toString()}`).then((response) => {
        if (response.ok) {
          response.json().then((data) => setResult(data.list));
        }
      });
    } else {
      setResult([]);
    }
  }, [search]);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setSearch(e.target.value);
    }, 500);
  };

  const onBlur = () => {
    clearTimeout(timeout);
    setTimeout(() => setSearch(""), 100);
  };

  const onEnter = () => {
    input.current?.blur();
    const search = input.current?.value;
    if (search && search.length > 0) {
      timeout = setTimeout(() => {
        clearTimeout(timeout);
        router.push(`/search?q=${search}`);
      }, 500);
    }
  };

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
