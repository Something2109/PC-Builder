import { ColumnWrapper, RowWrapper } from "@/components/utils/FlexWrapper";
import SummaryTable from "@/components/part/Summary";
import { RedirectButton } from "@/components/utils/Button";
import PaginationBar from "@/components/utils/PaginationBar";
import { FilterBar } from "@/components/part/Filter";
import { ToggleButton } from "@/components/utils/Toggle";
import { Product } from "@/utils/interface/part";
import { Products } from "@/utils/Enum";
import { notFound } from "next/navigation";

export default async function PartListPage({
  params,
  searchParams,
}: {
  params: Promise<{ part: Products }>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { part } = await params;
  const { part: _, ...query } = await searchParams;

  const queryEntries = Object.entries(query).reduce((acc, [key, value]) => {
    Array.isArray(value)
      ? value.forEach((v) => acc.push([key, v]))
      : acc.push([key, value]);
    return acc;
  }, [] as string[][]);
  const options = new URLSearchParams(queryEntries);

  const response = await Promise.all([
    fetch(`${process.env.BACKEND_HOST}/api/part/${part}?${options}`),
    fetch(`${process.env.BACKEND_HOST}/api/part/filter/${part}?${options}`),
  ]);

  if (!response[0].ok) return notFound();

  const [data, filter] = await Promise.all([
    response[0].json(),
    response[1].json(),
  ]);

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
          {response[1].ok && (
            <ToggleButton label="Filter">
              <FilterBar
                className="w-full border-2 border-line rounded-xl p-2"
                context={options}
                filter={filter}
                part={part}
              />
            </ToggleButton>
          )}
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
