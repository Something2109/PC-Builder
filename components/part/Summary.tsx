"use client";

import { PartSummaryCells } from "./summary/Part";
import { Info, Products } from "@/utils/Enum";
import {
  AttributeLabels,
  ProductInfo,
  SummaryAttributes,
  SummaryInfo,
} from "@/utils/interface";
import Part from "@/utils/interface/info/Parts";
import { lazy, TableHTMLAttributes } from "react";

export const SummaryInfoComponent = {
  [Info.CPU]: lazy(() => import("@/components/part/summary/CPU")),
  [Info.GPU]: lazy(() => import("@/components/part/summary/GPU")),
  [Info.GRAPHIC_CARD]: lazy(
    () => import("@/components/part/summary/GraphicCard")
  ),
  [Info.MAIN]: lazy(() => import("@/components/part/summary/Mainboard")),
  [Info.RAM]: lazy(() => import("@/components/part/summary/RAM")),
  [Info.HDD]: lazy(() => import("@/components/part/summary/HDD")),
  [Info.PSU]: lazy(() => import("@/components/part/summary/PSU")),
  [Info.CASE]: lazy(() => import("@/components/part/summary/Case")),
  [Info.COOLER]: lazy(() => import("@/components/part/summary/Cooler")),
  [Info.AIO]: lazy(() => import("@/components/part/summary/AIO")),
  [Info.FAN]: lazy(() => import("@/components/part/summary/Fan")),
  [Info.SSD]: lazy(() => import("@/components/part/summary/SSD")),
  [Info.CPU_BLOCK]: lazy(() => import("@/components/part/summary/CPUBlock")),
  [Info.PUMP]: lazy(() => import("@/components/part/summary/Pump")),
  [Info.RADIATOR]: lazy(() => import("@/components/part/summary/Radiator")),
};

export default function SummaryTable({
  data,
  className,
  part,
  ...rest
}: {
  data: SummaryInfo[];
  part: Products;
} & TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table className="w-full border-separate border-spacing-0" {...rest}>
      <TableHead part={part} />
      <TableBody data={data} part={part} />
    </table>
  );
}

const tableHead =
  "font-bold sticky top-32 bg-white dark:bg-background transition-colors ease-in-out duration-500 delay-0";
const tableRow = "*:p-2 lg:table-row *:lg:border-b-2 ";

const TableHead = ({ part }: { part: Products }) => (
  <thead className={tableHead}>
    <tr className={`hidden ${tableRow}`}>
      <td>{Part.Label.name}</td>
      <td>{Part.Label.brand}</td>
      <td>{Part.Label.series}</td>
      {ProductInfo[part]
        .map((info: Info) =>
          SummaryAttributes[info].map((attr) => AttributeLabels[info][attr])
        )
        .flat()
        .map((attr) => (
          <td key={`Header-${attr}`}>{attr}</td>
        ))}
    </tr>
  </thead>
);

const TableBody = ({ data, part }: { data: SummaryInfo[]; part: Products }) => (
  <tbody>
    {data.map((product) => (
      <tr
        key={product.id}
        className={`grid grid-cols-2 border-b-2 ${tableRow} hover:rounded-lg hover:bg-line hover:dark:text-background`}
      >
        <PartSummaryCells defaultValue={product} />
        {ProductInfo[part].map((info) => {
          const Component = SummaryInfoComponent[info];

          return (
            <Component
              key={`${product.id}-${info}`}
              defaultValue={product[info] as any}
            />
          );
        })}
      </tr>
    ))}
  </tbody>
);
