import PaginationBar from "@/components/pagination";
import PartPanel from "@/components/part/Panel";
import { SearchBar } from "@/components/searchbar";
import Part from "@/utils/interface/info/Parts";
import { notFound } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  let search = searchParams["q"] ?? "";
  const page = searchParams["page"] ?? "1";

  const params = new URLSearchParams(searchParams);

  const response = await fetch(
    `${process.env.BACKEND_HOST}/api/part?${params.toString()}`
  );

  if (!response.ok) return notFound();

  const data = (await response.json()) as {
    total: number;
    list: Part.BasicInfo[];
  };

  return (
    <>
      <SearchBar q={search} />
      <h1 id="list">{`${data.total} Result${data.total > 1 ? "s" : ""}`}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-flow-col-6 gap-1 xl:gap-3">
        {data.list.map((item: any, index: number) => (
          <PartPanel item={item} key={index} />
        ))}
      </div>
      <PaginationBar
        path={`/search?q=${search}`}
        current={Number(page)}
        total={Math.floor(data.total / Number(process.env.PageSize))}
      />
    </>
  );
}
