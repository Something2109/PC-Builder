import { getBackendUrl } from "@pc-builder/shared";
import Part from "@pc-builder/shared/part";
import { notFound } from "next/navigation";

import { ServerTablePagination } from "@/components/ui/Table";
import PartPanel from "@/features/part/components/Panel";
import { SearchBar } from "@/layout/searchbar";

export default async function Page({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ [key: string]: string }>;
}>) {
  const query = await searchParams;
  const search = query["q"] ?? "";
  const page = query["page"] ?? "1";
  const limit = query["limit"] ?? process.env.PageSize ?? "10";

  const params = new URLSearchParams(query);

  const response = await fetch(getBackendUrl(`/api/part?${params.toString()}`));

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
        {data.list.map((item) => (
          <PartPanel item={item} key={item.id} />
        ))}
      </div>
      <ServerTablePagination
        path={`/search?q=${search}`}
        page={Number(page)}
        pageSize={Number(limit)}
        total={data.total}
        totalPages={Math.ceil(data.total / Number(limit))}
        entryLabel="results"
      />
    </>
  );
}
