import {
  ColumnWrapper,
  ResponsiveWrapper,
  RowWrapper,
} from "@/components/utils/FlexWrapper";
import SummaryTable from "@/components/part/Summary";
import { RedirectButton } from "@/components/utils/Button";
import PaginationBar from "@/components/utils/PaginationBar";
import { FilterBar } from "@/components/filterbar";
import Part from "@/utils/interface/info/Parts";
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
  const query = await searchParams;

  const queryEntries = Object.entries(query).reduce((acc, [key, value]) => {
    Array.isArray(value)
      ? value.forEach((v) => acc.push([key, v]))
      : acc.push([key, value]);
    return acc;
  }, [] as string[][]);
  const options = new URLSearchParams(queryEntries);
  options.delete("part");

  const response = await fetch(
    `${process.env.BACKEND_HOST}/api/part/${part}?${options}`
  );

  if (!response) return notFound();

  const data = (await response.json()) as {
    total: number;
    list: Part.BasicInfo[];
  };

  const page = options.get("page") ?? "1";
  options.delete("page");

  return (
    <ResponsiveWrapper className="w-full">
      <ColumnWrapper className="hidden lg:block lg:w-1/5">
        <FilterBar context={options} part={part} />
      </ColumnWrapper>
      <ColumnWrapper className="lg:w-4/5">
        <RowWrapper className="justify-between place-items-center">
          <h1 className="text-xl font-bold" id="list">{`${
            data.total
          } ${part.toLocaleUpperCase()}`}</h1>
          <RedirectButton href={`/part/${part}/new`}>New</RedirectButton>
        </RowWrapper>
        <SummaryTable part={part} data={data.list} />
        <PaginationBar
          path={`/part/${part}?${options}`}
          current={Number(page)}
          total={Math.ceil(data.total / Number(process.env.PageSize))}
        />
      </ColumnWrapper>
    </ResponsiveWrapper>
  );
}
