"use client";

import { useProductSelect } from "./hook/ProductSelect";
import useProductLoad from "./hook/ProductLoad";
import SummaryTable from "../part/Summary";
import { FilterBar } from "../part/Filter";
import { ColumnWrapper, RowWrapper } from "../utils/FlexWrapper";
import { ToggleButton } from "../utils/Toggle";
import PaginationBar from "../utils/PaginationBar";
import { Product } from "@/utils/interface/part";

export default function BuildProductSummary() {
  const { product, params, page, setParams, setPage } = useProductSelect();
  const data = useProductLoad();

  if (!data) return "Loading";

  return (
    <ColumnWrapper>
      <RowWrapper className="flex-wrap justify-between place-items-center">
        <h1
          className="text-xl font-bold"
          id="list"
        >{`${data.total} ${Product.Label[product]}`}</h1>
        <ToggleButton label="Filter">
          <FilterBar
            action={(formData: FormData) => setParams(formData)}
            className="w-full border-2 border-line rounded-xl p-2"
            part={product}
            context={params}
          />
        </ToggleButton>
      </RowWrapper>
      <SummaryTable part={product} data={data.list} />
      <PaginationBar
        path={setPage}
        current={page}
        total={Math.ceil(data.total / Number(process.env.PageSize))}
      />
    </ColumnWrapper>
  );
}
