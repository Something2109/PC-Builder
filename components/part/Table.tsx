"use client";

import { Information } from "@/utils/interface/info";
import { Infos } from "@/utils/Enum";
import { lazy } from "react";
import { VerticalCollapsible } from "../utils/Collapsible";

export const DetailTableComponent = {
  [Infos.CPU]: lazy(() => import("@/components/part/detail/CPU")),
  [Infos.GPU]: lazy(() => import("@/components/part/detail/GPU")),
  [Infos.GRAPHIC_CARD]: lazy(
    () => import("@/components/part/detail/GraphicCard")
  ),
  [Infos.MAIN]: lazy(() => import("@/components/part/detail/Mainboard")),
  [Infos.RAM]: lazy(() => import("@/components/part/detail/RAM")),
  [Infos.HDD]: lazy(() => import("@/components/part/detail/HDD")),
  [Infos.PSU]: lazy(() => import("@/components/part/detail/PSU")),
  [Infos.CASE]: lazy(() => import("@/components/part/detail/Case")),
  [Infos.COOLER]: lazy(() => import("@/components/part/detail/Cooler")),
  [Infos.AIO]: lazy(() => import("@/components/part/detail/AIO")),
  [Infos.FAN]: lazy(() => import("@/components/part/detail/Fan")),
  [Infos.SSD]: lazy(() => import("@/components/part/detail/SSD")),
  [Infos.CPU_BLOCK]: lazy(() => import("@/components/part/detail/CPUBlock")),
  [Infos.PUMP]: lazy(() => import("@/components/part/detail/Pump")),
  [Infos.RADIATOR]: lazy(() => import("@/components/part/detail/Radiator")),
};

export function InfoTable({
  info,
  defaultValue,
}: {
  info: Infos;
  defaultValue?: any;
}) {
  const Component = DetailTableComponent[info];

  if (!defaultValue || !Component) return undefined;

  return (
    <VerticalCollapsible>
      <h1 className="text-4xl font-bold">{Information.Label[info]}</h1>
      <Component key={info} defaultValue={defaultValue} />
    </VerticalCollapsible>
  );
}
