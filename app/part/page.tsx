"use client";

import { Products } from "@/utils/Enum";
import { useEffect, useState } from "react";
import PartPanel from "@/components/part/Panel";
import Part from "@/utils/interface/part/Parts";
import { SearchBar } from "@/components/searchbar";

export default function List() {
  const [data, setList] = useState<Record<Products, Part.BasicInfo[]> | null>();
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/part`).then((response) => {
      if (response.ok) {
        response.json().then((data) => setList(data));
      } else {
        response.json().then((data) => setError(data.message));
      }
    });
  }, []);

  if (!data) return <h1>Loading</h1>;
  if (error) return <h1>{error}</h1>;

  return (
    <>
      <SearchBar />
      {Object.entries(data).map(([key, value]) => {
        return (
          <div key={`${key}-${value.length}`}>
            <h1 className="font-bold text-2xl my-2">{key.toUpperCase()}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-flow-col-6 gap-1 xl:gap-3">
              {value.map((value) => {
                return <PartPanel item={value} key={value.name} />;
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
