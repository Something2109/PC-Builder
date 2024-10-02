import React, { Context, useContext, useEffect, useState } from "react";
import PaginationBar from "@/components/pagination";
import PartTable from "@/components/part/Table";
import { FilterOptions } from "@/utils/interface";
import { Products } from "@/utils/Enum";
import { RowWrapper } from "./utils/FlexWrapper";
import { RedirectButton } from "./utils/Button";

export function TableLoader({
  part,
  context,
}: {
  part: Products;
  context: Context<FilterOptions>;
}) {
  const [page, setPage] = useState(1);
  const [data, setList] = useState({ total: 0, list: [] });
  const [error, setError] = useState(null);
  const options = useContext(context);

  useEffect(() => {
    fetch(`/api/part/${part}?page=${page}`, {
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

  if (data.list.length === 0) return <h1>The table is empty</h1>;

  return (
    <>
      <RowWrapper className="justify-between">
        <h1 className="text-xl font-bold" id="list">{`${
          data.total
        } ${part.toLocaleUpperCase()}`}</h1>
        <RedirectButton href={`/part/${part}/new`}>New</RedirectButton>
      </RowWrapper>
      <PartTable data={data.list} className="w-full" />
      <PaginationBar
        path={setPage}
        current={page}
        total={Math.ceil(data.total / Number(process.env.PageSize))}
      />
    </>
  );
}
