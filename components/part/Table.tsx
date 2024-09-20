import { PartType } from "@/utils/interface/Parts";
import { RowWrapper } from "../utils/FlexWrapper";
import PartPicture from "./Picture";
import { TableHTMLAttributes } from "react";

const tableRow = "*:p-2 border-b-2 lg:table-row";
const label = "lg:hidden";

export default function PartTable({
  data,
  ...rest
}: { data: PartType.BasicInfo[] } & TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table {...rest}>
      <thead className="font-bold sticky top-32 border-b-2 bg-white dark:bg-background">
        <tr className={`hidden ${tableRow}`}>
          <td>Name</td>
          <td>Brand</td>
          <td>Series</td>
          <td>Code Name</td>
        </tr>
      </thead>
      <tbody>
        {data.map((item: PartType.BasicInfo) => (
          <tr
            key={item.id}
            className={`flex flex-col ${tableRow} hover:rounded-lg hover:bg-line hover:dark:text-background`}
          >
            <td>
              <a href={`/part/${item.part}/${item.id}`}>
                <RowWrapper className="align-middle items-center font-bold">
                  <PartPicture part={item} className="h-16 m-2" />
                  {item.name}
                </RowWrapper>
              </a>
            </td>
            <td>
              <RowWrapper>
                <p className={label}>Brand:</p>
                {item.brand}
              </RowWrapper>
            </td>
            <td>
              <RowWrapper>
                <p className={label}>Series:</p>
                {item.series}
              </RowWrapper>
            </td>
            <td>
              <RowWrapper>
                <p className={label}>Code Name:</p>
                {item.code_name}
              </RowWrapper>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
