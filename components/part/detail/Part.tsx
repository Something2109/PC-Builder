import Part from "@/utils/interface/part";
import { TableHTMLAttributes } from "react";
import { TableRowWrapper, TableWrapper } from "../TableWrapper";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import PartPicture from "../Picture";
import { RedirectButton } from "@/components/utils/Button";

export function PartTable({
  defaultValue,
  ...rest
}: {
  defaultValue: Part.BasicInfo;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  let { id, part, url, launch_date } = defaultValue;
  launch_date = new Date(launch_date ?? new Date());

  return (
    <ResponsiveWrapper className="w-full">
      <PartPicture
        className="w-full lg:w-1/3"
        part={part}
        src={defaultValue.image_url ?? undefined}
      />
      <ColumnWrapper className="w-full lg:w-2/3 p-5">
        <h1 className="text-4xl font-bold">{defaultValue.name}</h1>
        <TableWrapper {...rest}>
          <TableRowWrapper>Code Name {defaultValue.code_name}</TableRowWrapper>
          <TableRowWrapper>Brand {defaultValue.brand}</TableRowWrapper>
          <TableRowWrapper>Series {defaultValue.series}</TableRowWrapper>
          <TableRowWrapper>
            Launch Date {launch_date.toISOString().slice(0, 10)}
          </TableRowWrapper>
          <TableRowWrapper>Brand URL {url}</TableRowWrapper>
        </TableWrapper>
        {url ? (
          <RedirectButton href={url} target="_blank">
            To brand page
          </RedirectButton>
        ) : undefined}
        <RedirectButton href={`/part/${part}/${id}/edit`} className="w-full">
          Edit
        </RedirectButton>
      </ColumnWrapper>
    </ResponsiveWrapper>
  );
}
