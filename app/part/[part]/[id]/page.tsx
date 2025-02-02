import { DetailTableComponent } from "@/components/part/Table";
import { PartTable } from "@/components/part/detail/Part";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { ObjectTable } from "@/components/utils/ObjectTable";
import { Products } from "@/utils/Enum";
import { notFound } from "next/navigation";
import React from "react";
import { DetailInfo, InfoLabels, ProductInfo } from "@/utils/interface";

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
      <PartTable className="border-2" defaultValue={partInfo} />
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
            const Component = DetailTableComponent[info];

            if (!partInfo[info] || !Component) return undefined;

            return (
              <>
                <h1 className="text-4xl font-bold">{InfoLabels[info]}</h1>
                <Component key={info} defaultValue={partInfo[info] as any} />
              </>
            );
          })}
        </ColumnWrapper>
      </ResponsiveWrapper>
    </>
  );
}
