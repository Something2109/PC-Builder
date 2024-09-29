"use client";

import { createContext, useEffect, useMemo, useState } from "react";
import PaginationBar from "@/components/pagination";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import PartTable from "@/components/part/Table";
import { FilterBar } from "@/components/filterbar";
import { FilterOptions } from "@/utils/interface";

const OptionContext = createContext<FilterOptions & { q?: string }>({});

export default function PartListPage({ params }: { params: { part: string } }) {
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState<FilterOptions>({
    part: { part: [params.part] },
  });
  const [data, setList] = useState({ total: 0, list: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/part/${params.part}?page=${page}`, {
      method: "POST",
      body: JSON.stringify(options),
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => setList(data));
        window.scroll({ top: 0, left: 0, behavior: "smooth" });
      } else {
        response.json().then((data) => setError(data.message));
      }
    });
  }, [page, options]);

  if (error) return <h1>{error}</h1>;

  const filter = useMemo(
    () => (
      <FilterBar
        context={OptionContext}
        defaultOptions={{ part: { part: [params.part] } }}
        set={setOptions}
      />
    ),
    [options]
  );

  return (
    <OptionContext.Provider value={options}>
      <ResponsiveWrapper className="w-full">
        <ColumnWrapper className="hidden lg:block lg:w-1/5">
          {filter}
        </ColumnWrapper>
        <ColumnWrapper className="lg:w-4/5">
          <h1 className="text-xl font-bold" id="list">{`${
            data.total
          } ${params.part.toLocaleUpperCase()}`}</h1>
          <PartTable data={data.list} className="w-full" />
          <PaginationBar
            path={setPage}
            current={page}
            total={Math.ceil(data.total / Number(process.env.PageSize))}
          />
        </ColumnWrapper>
      </ResponsiveWrapper>
    </OptionContext.Provider>
  );
}
