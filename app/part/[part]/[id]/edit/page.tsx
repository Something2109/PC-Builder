"use client";

import { InfoForm } from "@/components/part/Form";
import PartForm from "@/components/part/input/Part";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { ObjectTable } from "@/components/utils/ObjectTable";
import { Products, Info } from "@/utils/Enum";
import { DetailInfo, ProductInfo } from "@/utils/interface";
import { use, useEffect, useRef, useState } from "react";

export default function PartDetailEditPage({
  params,
}: {
  params: Promise<{ part: Products; id: string }>;
}) {
  const { part, id } = use(params);
  const SaveLink = useRef(`/api/part/${part}/${id}`);
  const [data, setData] = useState<DetailInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(SaveLink.current).then((response) => {
      if (response.ok) {
        response.json().then((data: DetailInfo) => {
          setData(data);
          console.log(data);
        });
      } else {
        response.json().then((data: { message: string }) => {
          setError(data.message);
        });
      }
    });
  }, []);

  if (!data && !error) {
    return <h1>Loading</h1>;
  }

  if (!data) {
    return <h1>{error}</h1>;
  }

  return (
    <>
      <PartForm path={SaveLink.current} part={part} defaultValue={data} />
      <ResponsiveWrapper className="w-full align-top">
        <ColumnWrapper className="basis-1/2">
          <h1 className="text-4xl font-bold">Raw</h1>
          <ObjectTable
            className="border-2"
            object={data?.raw ? JSON.parse(data.raw) : undefined}
          />
        </ColumnWrapper>
        <ColumnWrapper className="basis-1/2">
          {ProductInfo[part].map((info) => (
            <InfoForm
              key={info}
              path={SaveLink.current}
              info={info}
              defaultValue={data[info]}
            />
          ))}
        </ColumnWrapper>
      </ResponsiveWrapper>
    </>
  );
}
