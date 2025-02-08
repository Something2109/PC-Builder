"use client";

import {
  AttributeLabels,
  InfoLabels,
  ProductInfo,
  SummaryAttributes,
  SummaryInfo,
} from "@/utils/interface";
import { Products, Info } from "@/utils/Enum";
import { lazy, TableHTMLAttributes } from "react";
import { PartSummaryCells } from "./summary/Part";
import Part from "@/utils/interface/info/Parts";

const table = "border-separate border-spacing-0";
const tableHeader =
  "font-bold sticky top-32 bg-white dark:bg-background transition-colors ease-in-out duration-500 delay-0";
const tableRow = "*:p-2 lg:table-row *:lg:border-b-2 ";

export default function PartTable({
  data,
  className,
  part,
  ...rest
}: {
  data: SummaryInfo[];
  part: Products;
} & TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table className={className?.concat(" ", table) ?? table} {...rest}>
      <TableHead part={part} />
      <TableBody data={data} part={part} />
    </table>
  );
}

const TableHead = ({ part }: { part: Products }) => (
  <thead className={tableHeader}>
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

export const DetailTableComponent = {
  [Info.CPU]: lazy(() => import("@/components/part/detail/CPU")),
  [Info.GPU]: lazy(() => import("@/components/part/detail/GPU")),
  [Info.GRAPHIC_CARD]: lazy(
    () => import("@/components/part/detail/GraphicCard")
  ),
  [Info.MAIN]: lazy(() => import("@/components/part/detail/Mainboard")),
  [Info.RAM]: lazy(() => import("@/components/part/detail/RAM")),
  [Info.HDD]: lazy(() => import("@/components/part/detail/HDD")),
  [Info.PSU]: lazy(() => import("@/components/part/detail/PSU")),
  [Info.CASE]: lazy(() => import("@/components/part/detail/Case")),
  [Info.COOLER]: lazy(() => import("@/components/part/detail/Cooler")),
  [Info.AIO]: lazy(() => import("@/components/part/detail/AIO")),
  [Info.FAN]: lazy(() => import("@/components/part/detail/Fan")),
  [Info.SSD]: lazy(() => import("@/components/part/detail/SSD")),
  [Info.CPU_BLOCK]: lazy(() => import("@/components/part/detail/CPUBlock")),
  [Info.PUMP]: lazy(() => import("@/components/part/detail/Pump")),
  [Info.RADIATOR]: lazy(() => import("@/components/part/detail/Radiator")),
};

export function InfoTable({
  info,
  defaultValue,
}: {
  info: Info;
  defaultValue?: any;
}) {
  const Component = DetailTableComponent[info];

  if (!defaultValue || !Component) return undefined;

  return (
    <>
      <h1 className="text-4xl font-bold">{InfoLabels[info]}</h1>
      <Component key={info} defaultValue={defaultValue} />
    </>
  );
}
