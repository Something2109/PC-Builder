import Link from "next/link";
import { TableHTMLAttributes } from "react";

import { RowWrapper } from "@/ui/FlexWrapper";
import Part from "@/utils/part";

import PartPicture from "../Picture";

export function PartSummaryCells({
  defaultValue,
}: {
  defaultValue?: Part.Summary;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  if (!defaultValue) {
    return (
      <>
        <td className="lg:w-1/3 lg:min-w-72">{Part.Label.name}</td>
        <td className="lg:w-32 lg:min-w-24">{Part.Label.brand}</td>
        <td className="lg:w-36 lg:min-w-28">{Part.Label.series}</td>
      </>
    );
  }

  const { id, name, part, image_url, brand, series } = defaultValue;

  return (
    <>
      <td className="col-span-2 lg:w-1/3 lg:min-w-72 lg:max-w-xs" title={name}>
        <Link href={`/part/${part}/${id}`} className="block w-full max-w-full">
          <RowWrapper className="align-middle items-center font-bold lg:max-w-full lg:overflow-hidden lg:truncate">
            <PartPicture part={part} src={image_url ?? undefined} className="h-16 m-2 shrink-0" />
            <span className="lg:truncate">{name}</span>
          </RowWrapper>
        </Link>
      </td>
      <td className="lg:w-32 lg:min-w-24 lg:max-w-32 lg:truncate" title={brand || undefined}>
        <RowWrapper className="lg:max-w-full lg:overflow-hidden lg:truncate">
          <p className="lg:hidden">Brand:</p>
          {brand}
        </RowWrapper>
      </td>
      <td className="lg:w-36 lg:min-w-28 lg:max-w-36 lg:truncate" title={series || undefined}>
        <RowWrapper className="lg:max-w-full lg:overflow-hidden lg:truncate">
          <p className="lg:hidden">Series:</p>
          {series}
        </RowWrapper>
      </td>
    </>
  );
}
