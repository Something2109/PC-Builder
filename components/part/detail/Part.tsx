import Part from "@/utils/interface/part/Parts";
import { TableHTMLAttributes } from "react";
import { TableRowWrapper, TableWrapper } from "./utils";

export function PartTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<Part.BasicInfo>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  let { code_name, url, brand, series, launch_date }: typeof defaultValue =
    defaultValue ?? {};
  launch_date = new Date(launch_date ?? new Date());

  return (
    <TableWrapper {...rest}>
      <TableRowWrapper>Code Name {code_name}</TableRowWrapper>
      <TableRowWrapper>Brand {brand}</TableRowWrapper>
      <TableRowWrapper>Series {series}</TableRowWrapper>
      <TableRowWrapper>
        Launch Date {launch_date.toISOString().slice(0, 10)}
      </TableRowWrapper>
      <TableRowWrapper>Brand URL {url}</TableRowWrapper>
    </TableWrapper>
  );
}
