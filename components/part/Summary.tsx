"use client";

import { PartSummaryCells } from "./summary/Part";
import { Infos, Products } from "@/utils/Enum";
import { Information } from "@/utils/interface/info";
import { Product } from "@/utils/interface/product";
import { SummaryInfo } from "@/utils/interface";
import Part from "@/utils/interface/info/Parts";
import { lazy, TableHTMLAttributes } from "react";

export const SummaryInfoComponent = {
  [Infos.CPU]: lazy(() => import("@/components/part/summary/CPU")),
  [Infos.GPU]: lazy(() => import("@/components/part/summary/GPU")),
  [Infos.GRAPHIC_CARD]: lazy(
    () => import("@/components/part/summary/GraphicCard")
  ),
  [Infos.MAIN]: lazy(() => import("@/components/part/summary/Mainboard")),
  [Infos.RAM]: lazy(() => import("@/components/part/summary/RAM")),
  [Infos.HDD]: lazy(() => import("@/components/part/summary/HDD")),
  [Infos.PSU]: lazy(() => import("@/components/part/summary/PSU")),
  [Infos.CASE]: lazy(() => import("@/components/part/summary/Case")),
  [Infos.COOLER]: lazy(() => import("@/components/part/summary/Cooler")),
  [Infos.AIO]: lazy(() => import("@/components/part/summary/AIO")),
  [Infos.FAN]: lazy(() => import("@/components/part/summary/Fan")),
  [Infos.SSD]: lazy(() => import("@/components/part/summary/SSD")),
  [Infos.CPU_BLOCK]: lazy(() => import("@/components/part/summary/CPUBlock")),
  [Infos.PUMP]: lazy(() => import("@/components/part/summary/Pump")),
  [Infos.RADIATOR]: lazy(() => import("@/components/part/summary/Radiator")),
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
  "font-bold sticky top-32 bg-white dark:bg-background transition-bg";
const tableRow = "*:p-2 lg:table-row *:lg:border-b-2 ";

const TableHead = ({ part }: { part: Products }) => (
  <thead className={tableHead}>
    <tr className={`hidden ${tableRow}`}>
      <td>{Part.Label.name}</td>
      <td>{Part.Label.brand}</td>
      <td>{Part.Label.series}</td>
      {Product.Info[part]
        .map((info: Infos) =>
          Information.SummaryAttributes[info].map(
            (attr) => Information.AttributeLabels[info][attr]
          )
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
        {Product.Info[part].map((info) => {
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
