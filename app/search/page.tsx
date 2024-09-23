import PaginationBar from "@/components/pagination";
import PartPanel from "@/components/part/Panel";
import { SearchBar } from "@/components/searchbar";
import { Database } from "@/models/Database";
import { SearchString } from "@/utils/SearchString";
import { SearchParams } from "@/utils/SearchParams";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  let search = searchParams["q"] ?? "";

  const params = new URLSearchParams(searchParams);
  const options = {
    ...SearchParams.toFilterOptions(params),
    ...SearchParams.toPageOptions(params),
  };

  const { str, part } = SearchString.toProducts(search);
  if (!options.part && part.length > 0) options.part = part;

  const data = await Database.parts.search(str, options);

  if (!data) {
    return;
  }

  return (
    <>
      <SearchBar q={search} />
      <h1 id="list">{`${data.total} Result${data.total > 1 ? "s" : ""}`}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-flow-col-6 gap-1 xl:gap-3">
        {data.list.map((item: any, index) => (
          <PartPanel item={item} key={index} />
        ))}
      </div>
      <PaginationBar
        path={`/search?q=${search}`}
        current={options.page}
        total={Math.floor(data.total / Number(process.env.PageSize))}
      />
    </>
  );
}
