import { RowWrapper } from "../utils/FlexWrapper";
import PartPicture from "./Picture";
import { TableHTMLAttributes, TdHTMLAttributes } from "react";
import { SummaryInfo } from "@/utils/interface";
import { Products } from "@/utils/Enum";

const table = "border-separate border-spacing-0";
const tableHeader =
  "font-bold sticky top-32 bg-white dark:bg-background transition-colors ease-in-out duration-500 delay-0";
const tableRow = "*:p-2 lg:table-row";
const tableCell = "lg:border-b-2";
const label = "lg:hidden";

export default function PartTable({
  data,
  className,
  ...rest
}: { data: SummaryInfo<Products>[] } & TableHTMLAttributes<HTMLTableElement>) {
  let keys: { [key in Products]?: string[] } = {};
  const { id, part, name, brand, series, image_url, ...detail } = data[0];
  Object.entries(detail).forEach(
    ([key, value]) => (keys[key as Products] = Object.keys(value))
  );

  return (
    <table className={className?.concat(" ", table) ?? table} {...rest}>
      <thead className={tableHeader}>
        <tr className={`hidden ${tableRow}`}>
          <TableCell>Name</TableCell>
          <TableCell>Brand</TableCell>
          <TableCell>Series</TableCell>
          {Object.values(keys).map((attrs: string[]) =>
            attrs.map((attr) => (
              <TableCell key={`table-header-${attr}`}>{attr}</TableCell>
            ))
          )}
        </tr>
      </thead>
      <tbody>
        {data.map(({ id, part, name, brand, series, image_url, ...detail }) => (
          <tr
            key={id}
            className={`grid grid-cols-2 border-b-2 ${tableRow} hover:rounded-lg hover:bg-line hover:dark:text-background`}
          >
            <TableCell className="col-span-2">
              <a href={`/part/${part}/${id}`}>
                <RowWrapper className="align-middle items-center font-bold">
                  <PartPicture
                    part={{ image_url, part, name }}
                    className="h-16 m-2"
                  />
                  {name}
                </RowWrapper>
              </a>
            </TableCell>
            <TableCell>
              <RowWrapper>
                <p className={label}>Brand:</p>
                {brand}
              </RowWrapper>
            </TableCell>
            <TableCell>
              <RowWrapper>
                <p className={label}>Series:</p>
                {series}
              </RowWrapper>
            </TableCell>
            {Object.entries(keys).map(([key, attrs]) =>
              attrs.map((attr) => (
                <TableCell key={`table-body-${id}-${key}-${attr}`}>
                  <RowWrapper>
                    <p className={label}>{`${attr}:`}</p>
                    {(detail[key as Products] as Record<string, any>)[attr]}
                  </RowWrapper>
                </TableCell>
              ))
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TableCell({
  className,
  ...rest
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={className?.concat(" ", tableCell) ?? tableCell} {...rest} />
  );
}
