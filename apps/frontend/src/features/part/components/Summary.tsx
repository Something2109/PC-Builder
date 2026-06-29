"use client";

import Part, { Products } from "@pc-builder/shared/part";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { TableHTMLAttributes } from "react";
import React from "react";

import { DataTable } from "@/components/ui/Table";

import AIO from "./summary/AIO";
import Case from "./summary/Case";
import Cooler from "./summary/Cooler";
import CPU from "./summary/CPU";
import CPUBlock from "./summary/CPUBlock";
import Fan from "./summary/Fan";
import GPU from "./summary/GPU";
import GraphicCard from "./summary/GraphicCard";
import HDD from "./summary/HDD";
import Mainboard from "./summary/Mainboard";
import { PartColumns } from "./summary/Part";
import PSU from "./summary/PSU";
import Pump from "./summary/Pump";
import Radiator from "./summary/Radiator";
import RAM from "./summary/RAM";
import SSD from "./summary/SSD";

export const SummaryInfoComponent = {
  [Products.CPU]: CPU,
  [Products.GPU]: GPU,
  [Products.GRAPHIC_CARD]: GraphicCard,
  [Products.MAIN]: Mainboard,
  [Products.RAM]: RAM,
  [Products.HDD]: HDD,
  [Products.PSU]: PSU,
  [Products.CASE]: Case,
  [Products.COOLER]: Cooler,
  [Products.AIO]: AIO,
  [Products.FAN]: Fan,
  [Products.SSD]: SSD,
  [Products.CPU_BLOCK]: CPUBlock,
  [Products.PUMP]: Pump,
  [Products.RADIATOR]: Radiator,
};

export default function SummaryTable<Type extends Products, Data = Part.Summary<Type>>({
  part,
  data,
  columns = [],
  ...rest
}: {
  part: Type;
  data: Data[];
  columns?: ColumnDef<Data>[];
} & TableHTMLAttributes<HTMLTableElement>) {
  const columnList = React.useMemo(
    () => [...PartColumns, ...(SummaryInfoComponent[part] ?? []), ...columns] as ColumnDef<Data>[],
    [part, columns]
  );

  const table = useReactTable({
    data,
    columns: columnList,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DataTable
      table={table}
      isLoading={false}
      className={rest.className}
      tableClassName="w-full border-separate border-spacing-0"
      theadClassName="hidden lg:table-header-group bg-background/40 border-b border-border text-text/50 font-bold uppercase tracking-wider sticky top-0 z-10"
      rowClassName="grid grid-cols-2 border-b-2 lg:table-row *:lg:border-b-2 hover:rounded-lg hover:bg-line"
    />
  );
}
