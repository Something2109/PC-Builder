import { RowWrapper } from "../utils/FlexWrapper";
import PartPicture from "./Picture";
import { TableHTMLAttributes } from "react";
import { SummaryInfo } from "@/utils/interface";
import { Products } from "@/utils/Enum";

const tableRow = "*:p-2 border-b-2 lg:table-row";
const label = "lg:hidden";

export default function PartTable({
  data,
  ...rest
}: { data: SummaryInfo<Products>[] } & TableHTMLAttributes<HTMLTableElement>) {
  let keys: { [key in Products]?: string[] } = {};
  const { id, part, name, brand, series, image_url, ...detail } = data[0];
  Object.entries(detail).forEach(
    ([key, value]) => (keys[key as Products] = Object.keys(value))
  );

  return (
    <table {...rest}>
      <thead className="font-bold sticky top-32 border-b-2 bg-white dark:bg-background transition-all ease-in-out duration-500 delay-0">
        <tr className={`hidden ${tableRow}`}>
          <td>Name</td>
          <td>Brand</td>
          <td>Series</td>
          {Object.values(keys).map((attrs: string[]) =>
            attrs.map((attr) => <td key={`table-header-${attr}`}>{attr}</td>)
          )}
        </tr>
      </thead>
      <tbody>
        {data.map(({ id, part, name, brand, series, image_url, ...detail }) => (
          <tr
            key={id}
            className={`flex flex-col ${tableRow} hover:rounded-lg hover:bg-line hover:dark:text-background`}
          >
            <td>
              <a href={`/part/${part}/${id}`}>
                <RowWrapper className="align-middle items-center font-bold">
                  <PartPicture
                    part={{ image_url, part, name }}
                    className="h-16 m-2"
                  />
                  {name}
                </RowWrapper>
              </a>
            </td>
            <td>
              <RowWrapper>
                <p className={label}>Brand:</p>
                {brand}
              </RowWrapper>
            </td>
            <td>
              <RowWrapper>
                <p className={label}>Series:</p>
                {series}
              </RowWrapper>
            </td>
            {Object.entries(keys).map(([key, attrs]) =>
              attrs.map((attr) => (
                <td key={`table-body-${id}-${key}-${attr}`}>
                  <RowWrapper>
                    <p className={label}>{key}</p>
                    {(detail[key as Products] as Record<string, any>)[attr]}
                  </RowWrapper>
                </td>
              ))
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
