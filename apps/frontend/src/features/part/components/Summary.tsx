"use client";

import { ComponentType, lazy, TableHTMLAttributes } from "react";

import Part, { Products } from "@pc-builder/shared/part";

import { PartSummaryCells } from "./summary/Part";
import { SummaryTable as Table } from "./utils/Summary";

export const SummaryInfoComponent = {
  [Products.CPU]: lazy(() => import("@/features/part/components/summary/CPU")),
  [Products.GPU]: lazy(() => import("@/features/part/components/summary/GPU")),
  [Products.GRAPHIC_CARD]: lazy(() => import("@/features/part/components/summary/GraphicCard")),
  [Products.MAIN]: lazy(() => import("@/features/part/components/summary/Mainboard")),
  [Products.RAM]: lazy(() => import("@/features/part/components/summary/RAM")),
  [Products.HDD]: lazy(() => import("@/features/part/components/summary/HDD")),
  [Products.PSU]: lazy(() => import("@/features/part/components/summary/PSU")),
  [Products.CASE]: lazy(() => import("@/features/part/components/summary/Case")),
  [Products.COOLER]: lazy(() => import("@/features/part/components/summary/Cooler")),
  [Products.AIO]: lazy(() => import("@/features/part/components/summary/AIO")),
  [Products.FAN]: lazy(() => import("@/features/part/components/summary/Fan")),
  [Products.SSD]: lazy(() => import("@/features/part/components/summary/SSD")),
  [Products.CPU_BLOCK]: lazy(() => import("@/features/part/components/summary/CPUBlock")),
  [Products.PUMP]: lazy(() => import("@/features/part/components/summary/Pump")),
  [Products.RADIATOR]: lazy(() => import("@/features/part/components/summary/Radiator")),
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
          <Table.Row key={`Row-${product.id}`} className="hover:rounded-lg hover:bg-line">
            {Components.map((Component) => (
              <Component key={`Row-${Component.name}-${product.id}`} defaultValue={product} />
            ))}
          </Table.Row>
        ))}
      </tbody>
    </Table.Component>
  );
}
