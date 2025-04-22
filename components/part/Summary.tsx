"use client";

import { PartSummaryCells } from "./summary/Part";
import { Products } from "@/utils/Enum";
import Part, { Product } from "@/utils/interface/part";
import { lazy, TableHTMLAttributes, useMemo } from "react";

export const SummaryInfoComponent = {
  [Products.CPU]: lazy(() => import("@/components/part/summary/CPU")),
  [Products.GPU]: lazy(() => import("@/components/part/summary/GPU")),
  [Products.GRAPHIC_CARD]: lazy(
    () => import("@/components/part/summary/GraphicCard")
  ),
  [Products.MAIN]: lazy(() => import("@/components/part/summary/Mainboard")),
  [Products.RAM]: lazy(() => import("@/components/part/summary/RAM")),
  [Products.HDD]: lazy(() => import("@/components/part/summary/HDD")),
  [Products.PSU]: lazy(() => import("@/components/part/summary/PSU")),
  [Products.CASE]: lazy(() => import("@/components/part/summary/Case")),
  [Products.COOLER]: lazy(() => import("@/components/part/summary/Cooler")),
  [Products.AIO]: lazy(() => import("@/components/part/summary/AIO")),
  [Products.FAN]: lazy(() => import("@/components/part/summary/Fan")),
  [Products.SSD]: lazy(() => import("@/components/part/summary/SSD")),
  [Products.CPU_BLOCK]: lazy(
    () => import("@/components/part/summary/CPUBlock")
  ),
  [Products.PUMP]: lazy(() => import("@/components/part/summary/Pump")),
  [Products.RADIATOR]: lazy(() => import("@/components/part/summary/Radiator")),
};

export default function SummaryTable({
  data,
  className,
  part,
  ...rest
}: {
  data: Part.Summary[];
  part: Products;
} & TableHTMLAttributes<HTMLTableElement>) {
  const TableHeader = useMemo(() => <TableHead part={part} />, [part]);

  return (
    <table className="w-full border-separate border-spacing-0" {...rest}>
      {TableHeader}
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
      {Product.Summary[part].keyof().options.map((attr) => (
        <td key={`Header-${attr}`}>{Product.AttributeLabels[part][attr]}</td>
      ))}
    </tr>
  </thead>
);

const TableBody = ({
  data,
  part,
}: {
  data: Part.Summary[];
  part: Products;
}) => {
  const Component = SummaryInfoComponent[part];

  return (
    <tbody>
      {data.map((product) => (
        <tr
          key={product.id}
          className={`grid grid-cols-2 border-b-2 ${tableRow} hover:rounded-lg hover:bg-line hover:dark:text-background`}
        >
          <PartSummaryCells defaultValue={product} />
          <Component key={`${product.id}`} defaultValue={product as any} />
        </tr>
      ))}
    </tbody>
  );
};
