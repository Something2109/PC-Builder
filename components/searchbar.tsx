"use client";

import { PartInformation as PartInformationType } from "@/models/parts/Part";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { ColumnWrapper } from "./utils/FlexWrapper";

export function SearchBar({ q, part }: { q?: string; part?: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState<string>(q ?? "");
  const [result, setResult] = useState<PartInformationType[]>([]);
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

  const onEnter = () => {
    const search = input.current?.value;
    if (search && search.length > 0) {
      timeout = setTimeout(() => {
        clearTimeout(timeout);
        router.push(`/search?q=${search}`);
        setResult([]);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border-2">
      <div className="flex flex-row my-1 px-4">
        <input
          ref={input}
          defaultValue={q}
          type="text"
          placeholder="Search"
          className=" focus:outline-none w-full bg-transparent border-black dark:border-line"
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key == "Enter") onEnter();
          }}
        />
        <button type="button" onClick={onEnter}>
          Search
        </button>
      </div>

      <ColumnWrapper>
        {result.map((value) => {
          return (
            <a
              href={`/part/${value.part}/${value.id}`}
              key={`search-${value.id}`}
              className="px-4 py-1 rounded-2xl hover:bg-line"
            >
              {value.name}
            </a>
          );
        })}
      </ColumnWrapper>
    </div>
  );
}
