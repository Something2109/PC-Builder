import Part from "@/utils/part";
import { TableHTMLAttributes } from "react";
import { RowWrapper } from "@/components/utils/FlexWrapper";
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

  let { id, name, part, image_url, brand, series } = defaultValue;

  return (
    <>
      <td className="col-span-2">
        <a href={`/part/${part}/${id}`}>
          <RowWrapper className="align-middle items-center font-bold">
            <PartPicture
              part={part}
              src={image_url ?? undefined}
              className="h-16 m-2"
            />
            {name}
          </RowWrapper>
        </a>
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
