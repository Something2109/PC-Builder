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
        <td>{Part.Label.name}</td>
        <td>{Part.Label.brand}</td>
        <td>{Part.Label.series}</td>
      </>
    );
  }

  const { id, name, part, image_url, brand, series } = defaultValue;

  return (
    <>
      <td className="col-span-2">
        <Link href={`/part/${part}/${id}`}>
          <RowWrapper className="align-middle items-center font-bold">
            <PartPicture part={part} src={image_url ?? undefined} className="h-16 m-2" />
            {name}
          </RowWrapper>
        </Link>
      </td>
      <td>
        <RowWrapper>
          <p className="lg:hidden">Brand:</p>
          {brand}
        </RowWrapper>
      </td>
      <td>
        <RowWrapper>
          <p className="lg:hidden">Series:</p>
          {series}
        </RowWrapper>
      </td>
    </>
  );
}
