import * as API from "@pc-builder/shared/API";
import Part from "@pc-builder/shared/part";
import { notFound } from "next/navigation";

import { ServerTablePagination } from "@/components/ui/Table";
import PartPanel from "@/features/part/components/Panel";
import { SearchBar } from "@/layout/searchbar";
import { getBackendUrl } from "@/utils/path";

export default async function ListPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ [key: string]: string }>;
}>) {
  const query = await searchParams;

  const queryEntries = Object.entries(query).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => acc.push([key, v]));
      return acc;
    }

    acc.push([key, value]);
    return acc;
  }, [] as string[][]);
  const options = new URLSearchParams(queryEntries);

  const response = await fetch(getBackendUrl(`/api/part?${options}`));

  if (!response) return notFound();

  const data = (await response.json()) as API.Payload<Part.Summary>;

  const page = options.get("page") ?? "1";
  const limit = options.get("limit") ?? process.env.PageSize ?? "10";
  options.delete("page");
  options.delete("limit");

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-text">Hardware Directory</h1>
        <p className="text-sm text-text/60 mt-1">
          Browse through our comprehensive directory of PC components, specs, and details.
        </p>
      </div>

      {/* Floating Search Bar */}
      <div className="max-w-2xl">
        <SearchBar />
      </div>

      <hr className="border-border/60" />

      {/* Search Result Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">
          {`${data.total.toLocaleString()} Component${data.total !== 1 ? "s" : ""} Available`}
        </h2>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
        {data.list.map((value) => {
          return <PartPanel item={value} key={value.id} />;
        })}
      </div>

      {/* Pagination */}
      <ServerTablePagination
        path={`/part?${options.toString()}`}
        page={Number(page)}
        pageSize={Number(limit)}
        total={data.total}
        totalPages={Math.ceil(data.total / Number(limit))}
        entryLabel="components"
      />
    </div>
  );
}
