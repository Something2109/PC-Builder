import { DetailTableComponent } from "@/components/part/Table";
import { PartTable } from "@/components/part/detail/Part";
import PartPicture from "@/components/part/Picture";
import { RedirectButton } from "@/components/utils/Button";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { ObjectTable } from "@/components/utils/ObjectTable";
import { Products } from "@/utils/Enum";
import { notFound } from "next/navigation";
import React from "react";
import { DetailInfo, ProductInfo } from "@/utils/interface";

export default async function PartDetailPage({
  params: { part, id },
}: {
  params: { part: Products; id: string };
}) {
  const response = await fetch(
    `${process.env.BACKEND_HOST}/api/part/${part}/${id}`
  );

  if (!response.ok) return notFound();

  const partInfo = (await response.json()) as DetailInfo;

  return (
    <>
      <ResponsiveWrapper className="w-full">
        <PartPicture className="w-full lg:w-1/3" part={partInfo} />

        <ColumnWrapper className="w-full lg:w-2/3 p-5">
          <h1 className="text-4xl font-bold">{partInfo.name}</h1>
          <PartTable className="border-2" defaultValue={partInfo} />
          {partInfo.url ? (
            <RedirectButton href={partInfo.url} target="_blank">
              To brand page
            </RedirectButton>
          ) : undefined}
          <RedirectButton href={`/part/${part}/${id}/edit`} className="w-full">
            Edit
          </RedirectButton>
        </ColumnWrapper>
      </ResponsiveWrapper>
      <ResponsiveWrapper className="w-full align-top">
        <ColumnWrapper className="basis-1/2">
          <h1 className="text-4xl font-bold">Raw</h1>
          <ObjectTable
            className="border-2"
            object={partInfo.raw ? JSON.parse(partInfo.raw) : undefined}
          />
        </ColumnWrapper>
        <ColumnWrapper className="basis-1/2">
          {ProductInfo[part].map((info) => {
            if (!partInfo[info]) return undefined;

            const Component = DetailTableComponent[info];

            return (
              <>
                <h1 className="text-4xl font-bold">{info}</h1>
                <Component key={info} defaultValue={partInfo[info] as any} />
              </>
            );
          })}
        </ColumnWrapper>
      </ResponsiveWrapper>
    </>
  );
}
