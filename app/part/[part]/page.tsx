"use client";

import { createContext, useEffect, useState } from "react";
import PaginationBar from "@/components/pagination";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import PartTable from "@/components/part/Table";
import { FilterBar } from "@/components/filterbar";
import { toSearchParams } from "@/utils/SearchParams";
import { PartType } from "@/utils/interface/Parts";

const OptionContext = createContext<PartType.FilterOptions & { q?: string }>(
  {}
);

export default function PartListPage({ params }: { params: { part: string } }) {
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState<PartType.FilterOptions>({
    part: [params.part],
  });
  const [data, setList] = useState({ total: 0, list: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(
      `/api/part/${params.part}?page=${page}&${toSearchParams(options)}`
    ).then((response) => {
      if (response.ok) {
        response.json().then((data) => setList(data));
      } else {
        response.json().then((data) => setError(data.message));
      }
    });
  }, [page, options]);

  if (error) return <h1>{error}</h1>;

  return (
    <OptionContext.Provider value={options}>
      <ResponsiveWrapper className="w-full">
        <ColumnWrapper className="hidden lg:block lg:w-1/5">
          <FilterBar
            context={OptionContext}
            defaultOptions={{ part: [params.part] }}
            set={setOptions}
          />
        </ColumnWrapper>
        <ColumnWrapper className="lg:w-4/5">
          <h1 className="text-xl font-bold" id="list">{`${
            data.total
          } ${params.part.toLocaleUpperCase()}`}</h1>
          <PartTable data={data.list} className="w-full" />
          <PaginationBar
            path={setPage}
            current={page}
            total={Math.floor(data.total / 50)}
          />
        </ColumnWrapper>
      </ResponsiveWrapper>
    </OptionContext.Provider>
  );
}
