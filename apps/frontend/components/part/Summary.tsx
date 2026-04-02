"use client";

import { PartSummaryCells } from "./summary/Part";
import { SummaryTable as Table } from "./utils/Summary";
import Part, { Products } from "@/utils/part";
import { ComponentType, lazy, TableHTMLAttributes } from "react";

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
  part,
  data,
  Cells = [],
  ...rest
}: {
  part: Products;
  data: Part.Summary<typeof part>[];
  Cells?: ComponentType<{ defaultValue?: Part.Summary<typeof part> }>[];
} & TableHTMLAttributes<HTMLTableElement>) {
  const Components = [PartSummaryCells, SummaryInfoComponent[part], ...Cells];

  return (
    <Table.Component {...rest}>
      <Table.Head>
        <Table.Row>
          {Components.map((Component, index) => (
            <Component key={`Header-${Component.name}-${index}`} />
          ))}
        </Table.Row>
      </Table.Head>
      <tbody>
        {data.map((product) => (
          <Table.Row
            key={`Row-${product.id}`}
            className="hover:rounded-lg hover:bg-line hover:dark:text-background"
          >
            {Components.map((Component) => (
              <Component
                key={`Row-${Component.name}-${product.id}`}
                defaultValue={product}
              />
            ))}
          </Table.Row>
        ))}
      </tbody>
    </Table.Component>
  );
}
