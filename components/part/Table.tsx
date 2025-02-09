"use client";

import { InfoLabels } from "@/utils/interface";
import { Info } from "@/utils/Enum";
import { lazy } from "react";

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
