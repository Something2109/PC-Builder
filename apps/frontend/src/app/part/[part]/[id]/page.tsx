import { notFound } from "next/navigation";
import React from "react";

import { PartTable } from "@/features/part/components/detail/Part";
import { InfoTable } from "@/features/part/components/Table";
import { ResponsiveWrapper } from "@/ui/FlexWrapper";
import Part, { Products, Mapping } from "@/utils/part";
import { getBackendUrl } from "@/utils/path";

export default async function PartDetailPage({
  params,
}: {
  params: Promise<{ part: Products; id: string }>;
}) {
  const { part, id } = await params;

  const response = await fetch(getBackendUrl(`/api/part/${part}/${id}`));

  if (!response.ok) return notFound();

  const data = (await response.json()) as Part.Model;

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
