import { InfoTable } from "@/components/part/Table";
import { PartTable } from "@/components/part/detail/Part";
import { ResponsiveWrapper } from "@/components/utils/FlexWrapper";
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
      <ResponsiveWrapper className="w-full align-top flex-wrap">
        {Mapping.Info[part].map((info) => (
          <InfoTable key={info} info={info} defaultValue={data[info]} />
        ))}
      </ResponsiveWrapper>
    </>
  );
}
