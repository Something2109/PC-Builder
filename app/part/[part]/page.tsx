"use client";

import { useEffect, useState } from "react";
import PaginationBar from "@/components/pagination";
import { SearchBar } from "@/components/searchbar";
import { RowWrapper } from "@/components/utils/FlexWrapper";
import PartTable from "@/components/part/Table";

export default function PartListPage({ params }: { params: { part: string } }) {
  const [page, setPage] = useState(1);
  const [data, setList] = useState({ total: 0, list: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/part/${params.part}?page=${page}`).then((response) => {
      if (response.ok) {
        response.json().then((data) => setList(data));
      } else {
        response.json().then((data) => setError(data.message));
      }
    });
  }, [page]);

  if (error) return <h1>{error}</h1>;

  return (
    <>
      <RowWrapper className="w-full justify-between items-center">
        <h1 className="text-xl font-bold" id="list">{`${
          data.total
        } ${params.part.toLocaleUpperCase()}`}</h1>
        <SearchBar part={params.part} />
      </RowWrapper>
      <PartTable data={data.list} />
      <PaginationBar
        path={setPage}
        current={page}
        total={Math.floor(data.total / 50)}
      />
    </>
  );
}
