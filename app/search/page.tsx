import PaginationBar from "@/components/pagination";
import PartPanel from "@/components/part/Panel";
import { SearchBar } from "@/components/searchbar";
import { Database } from "@/models/Database";
import { Extract } from "@/utils/Extract";

export default async function Page({
  searchParams: { q, page },
}: {
  searchParams: { q?: string; page?: number };
}) {
  q = q ?? "";
  page = Number(page ?? 1);

  const { str, part } = Extract.products(q);
  const data = await Database.parts.search(str, {
    page,
    limit: 50,
    part: part.length > 0 ? part : undefined,
  });

  if (!data) {
    return;
  }

  return (
    <>
      <SearchBar q={q} />
      <h1 id="list">{`${data.total} Result${data.total > 1 ? "s" : ""}`}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-flow-col-6 gap-1 xl:gap-3">
        {data.list.map((item: any, index) => (
          <PartPanel item={item} key={index} />
        ))}
      </div>
      <PaginationBar
        path={`/search?q=${q}`}
        current={page}
        total={Math.floor(data.total / 50)}
      />
    </>
  );
}
