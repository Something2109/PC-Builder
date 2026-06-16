import { notFound } from "next/navigation";

import { FilterBar } from "@/features/part/components/Filter";
import SummaryTable from "@/features/part/components/Summary";
import { RedirectButton } from "@/ui/Button";
import { ColumnWrapper, RowWrapper } from "@/ui/FlexWrapper";
import PaginationBar from "@/ui/PaginationBar";
import { ToggleButton } from "@/ui/Toggle";
import { Product } from "@/utils/part";
import { getBackendUrl } from "@/utils/path";

export default async function PartListPage({
  params,
  searchParams,
}: {
  params: Promise<{ part: Product.Name }>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { part } = await params;
  const { part: _, ...query } = await searchParams;

  const queryEntries = Object.entries(query).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => acc.push([key, v]));
      return acc;
    }

    acc.push([key, value]);
    return acc;
  }, [] as string[][]);
  const options = new URLSearchParams(queryEntries);

  const response = await fetch(getBackendUrl(`/api/part/${part}?${options}`));
  if (!response.ok) return notFound();

  const data = await response.json();

  const page = options.get("page") ?? "1";
  options.delete("page");

  return (
    <ColumnWrapper className="w-full">
      <ColumnWrapper>
        <RowWrapper className="flex-wrap justify-between place-items-center">
          <h1
            className="text-xl font-bold"
            id="list"
          >{`${data.total} ${Product.Label[part]}`}</h1>
          <ToggleButton label="Filter">
            <FilterBar
              className="w-full border-2 border-line rounded-xl p-2"
              part={part}
              context={options}
            />
          </ToggleButton>
        </RowWrapper>
        <SummaryTable part={part} data={data.list} />
        <RedirectButton href={`/part/${part}/new`}>New</RedirectButton>
        <PaginationBar
          path={`/part/${part}?${options}`}
          current={Number(page)}
          total={Math.ceil(data.total / Number(process.env.PageSize))}
        />
      </ColumnWrapper>
    </ColumnWrapper>
  );
}
