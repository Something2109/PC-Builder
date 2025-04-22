import PartPanel from "@/components/part/Panel";
import { SearchBar } from "@/components/searchbar";
import PaginationBar from "@/components/utils/PaginationBar";
import Part from "@/utils/interface/part";
import { notFound } from "next/navigation";

export default async function ListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const query = await searchParams;

  const queryEntries = Object.entries(query).reduce((acc, [key, value]) => {
    Array.isArray(value)
      ? value.forEach((v) => acc.push([key, v]))
      : acc.push([key, value]);
    return acc;
  }, [] as string[][]);
  const options = new URLSearchParams(queryEntries);

  const response = await fetch(
    `${process.env.BACKEND_HOST}/api/part?${options}`
  );

  if (!response) return notFound();

  const data = (await response.json()) as {
    total: number;
    list: Part.BasicInfo[];
  };

  const page = options.get("page") ?? "1";
  options.delete("page");

  return (
    <>
      <SearchBar />
      <h1 className="font-bold text-2xl my-2">
        {`${data.total} Product${data.total > 1 ? "s" : ""}`}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-flow-col-6 gap-1 xl:gap-3">
        {data.list.map((value) => {
          return <PartPanel item={value} key={value.name} />;
        })}
      </div>
      <PaginationBar
        path={`/part`}
        current={Number(page)}
        total={Math.ceil(data.total / Number(process.env.PageSize))}
      />
    </>
  );
}
