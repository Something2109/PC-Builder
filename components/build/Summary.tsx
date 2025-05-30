"use client";

import { useProductType } from "./hook/ProductType";
import useProductSummary from "./hook/ProductSummary";
import { useBuildContext } from "./hook/BuildContext";
import SummaryTable from "../part/Summary";
import { FilterBar } from "../part/Filter";
import { ColumnWrapper, RowWrapper } from "../utils/FlexWrapper";
import { ToggleButton } from "../utils/Toggle";
import { Button } from "../utils/Button";
import PaginationBar from "../utils/PaginationBar";
import Part, { Product } from "@/utils/interface/part";

export default function BuildProductSummary() {
  const { productType: product } = useProductType();
  const { details, add } = useBuildContext();
  const { data, params, page, setParams, setPage } = useProductSummary();

  if (!data) return "Loading";

  const AddButton = ({ defaultValue }: { defaultValue?: Part.Summary }) => {
    if (!defaultValue) return <td></td>;

    const addable = !details[product] || Array.isArray(details[product]);
    return (
      <td>
        {addable && <Button onClick={() => add(defaultValue)}>Add</Button>}
      </td>
    );
  };

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
      <SummaryTable part={product} data={data.list} Cells={[AddButton]} />
      <PaginationBar
        path={setPage}
        current={page}
        total={Math.ceil(data.total / Number(process.env.PageSize))}
      />
    </ColumnWrapper>
  );
}
