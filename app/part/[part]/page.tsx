"use client";

import { useEffect, useState } from "react";
import ListItem from "../_component/PartItem";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import PaginationBar from "@/components/pagination";

export default function PartListPage({ params }: { params: { part: string } }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  let current = Number(searchParams.get("page"));
  if (current && current < 1) {
    redirect(pathname);
  } else if (current == 0) {
    current = 1;
  }

  const [data, setList] = useState({ list: [], pages: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/part/${params.part}?${searchParams}`).then((response) => {
      if (response.ok) {
        response.json().then((data) => setList(data));
      } else {
        response.json().then((data) => setError(data.message));
      }
    });
  }, []);

  if (error) return <h1>{error}</h1>;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-flow-col-6 gap-1 xl:gap-3">
        {data.list.map((item: any, index) => (
          <ListItem item={item} key={index} />
        ))}
      </div>
      <PaginationBar path={pathname} current={current} total={data.pages} />
    </>
  );
}
