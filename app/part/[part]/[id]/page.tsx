import { InfoTable } from "@/components/part/Table";
import { PartTable } from "@/components/part/detail/Part";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { ObjectTable } from "@/components/utils/ObjectTable";
import { Products } from "@/utils/Enum";
import { notFound } from "next/navigation";
import React from "react";
import Part, { Mapping } from "@/utils/interface/part";

export default async function PartDetailPage({
  params,
}: {
  params: Promise<{ part: Products; id: string }>;
}) {
  const { part, id } = await params;

  const response = await fetch(
    `${process.env.BACKEND_HOST}/api/part/${part}/${id}`
  );

  if (!response.ok) return notFound();

  const data = (await response.json()) as Part.Detail;

  return (
    <>
      <PartTable className="border-2" defaultValue={data} />
      <ResponsiveWrapper className="w-full align-top">
        <ColumnWrapper className="basis-1/2">
          <h1 className="text-4xl font-bold">Raw</h1>
          <ObjectTable
            className="border-2"
            object={JSON.parse((data as any).raw ?? "{}")}
          />
        </ColumnWrapper>
        <ColumnWrapper className="basis-1/2">
          {Mapping.Info[part].map((info) => (
            <InfoTable key={info} info={info} defaultValue={data[info]} />
          ))}
        </ColumnWrapper>
      </ResponsiveWrapper>
    </>
  );
}
