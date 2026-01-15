"use client";

import useProductSummary from "@/components/hook/build/ProductSummary";
import { useBuildContext } from "@/components/hook/build/BuildContext";
import SummaryTable from "@/components/part/Summary";
import { FilterBar } from "@/components/part/Filter";
import { ColumnWrapper, RowWrapper } from "@/components/utils/FlexWrapper";
import { ToggleButton } from "@/components/utils/Toggle";
import { Button } from "@/components/utils/Button";
import PaginationBar from "@/components/utils/PaginationBar";
import Part, { Product } from "@/utils/part";
import { use } from "react";
import { useRouter } from "next/navigation";
import { ChoiceInput } from "@/components/utils/Input";
import LoadingPanel from "@/components/utils/LoadingPanel";
import ErrorPanel from "@/components/utils/ErrorPanel";

export default function BuildProductSummary({
  params: productParams,
}: {
  params: Promise<{ product: Product.Name }>;
}) {
  const router = useRouter();
  const { product } = use(productParams);
  const { details, add: addDetails } = useBuildContext();
  const {
    loading,
    data,
    params,
    page,
    includeBuild,
    setParams,
    setPage,
    setIncludeBuild,
  } = useProductSummary(product);

  if (loading)
    return <LoadingPanel className="h-[70vh]" text="Loading Product" />;

  if (!data)
    return (
      <ErrorPanel
        className="h-[70vh]"
        text="Cannot find any product right now..."
        reset={() => {}}
      />
    );

  const addable = !details[product] || Array.isArray(details[product]);

  const add = (defaultValue: Part.Summary) => {
    addDetails(defaultValue);
    router.push("/build");
  };

  const AddButton = ({ defaultValue }: { defaultValue?: Part.Summary }) => {
    if (!defaultValue || !addable) return <td></td>;

    return (
      <td>
        <Button onClick={() => add(defaultValue)}>Add</Button>
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
        <RowWrapper>
          <ChoiceInput
            type="checkbox"
            onChange={() => setIncludeBuild(!includeBuild)}
            defaultChecked={includeBuild}
          />
          <label>Include Build</label>
        </RowWrapper>
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
