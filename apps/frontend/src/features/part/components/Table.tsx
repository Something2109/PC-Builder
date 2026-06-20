"use client";

import { lazy, LazyExoticComponent } from "react";

import { ColumnWrapper } from "@/ui/FlexWrapper";
import Part from "@pc-builder/shared/part";
import { Infos, Information } from "@pc-builder/shared/part";

type InfoTableComponent<T extends Infos> = React.FC<{
  defaultValue: Part.Model[T];
}>;

export const DetailTableComponent: {
  [key in Infos]: LazyExoticComponent<InfoTableComponent<key>>;
} = {
  [Infos.CPU_SPEC]: lazy(() => import("@/features/part/components/detail/CPUSpec")),
  [Infos.CPU_PERF]: lazy(() => import("@/features/part/components/detail/CPUPerformance")),
  [Infos.CPU_CORES]: lazy(() => import("@/features/part/components/detail/CPUCoreConfig")),
  [Infos.CPU_MEMORY]: lazy(() => import("@/features/part/components/detail/CPUMemory")),
  [Infos.GPU_SPEC]: lazy(() => import("@/features/part/components/detail/GPUSpec")),
  [Infos.GPU_PERF]: lazy(() => import("@/features/part/components/detail/GPUPerformance")),
  [Infos.GPU_FEAT]: lazy(() => import("@/features/part/components/detail/GPUFeature")),
  [Infos.GPU_MEMORY]: lazy(() => import("@/features/part/components/detail/GPUMemory")),
  [Infos.PROCESSOR_CACHE]: lazy(() => import("@/features/part/components/detail/ProcessorCache")),
  [Infos.GRAPHIC_CARD_SPEC]: lazy(
    () => import("@/features/part/components/detail/GraphicCardSpec")
  ),
  [Infos.GRAPHIC_CARD_PORT]: lazy(
    () => import("@/features/part/components/detail/GraphicCardPort")
  ),
  [Infos.MAIN_SPEC]: lazy(() => import("@/features/part/components/detail/MainboardSpec")),
  [Infos.MAIN_POWER]: lazy(
    () => import("@/features/part/components/detail/MainboardPowerConnector")
  ),
  [Infos.MAIN_PCIE]: lazy(() => import("@/features/part/components/detail/MainboardPCIe")),
  [Infos.MAIN_STORAGE]: lazy(
    () => import("@/features/part/components/detail/MainboardStorageConnector")
  ),
  [Infos.MAIN_USB]: lazy(() => import("@/features/part/components/detail/MainboardUSBConnector")),
  [Infos.MAIN_FAN]: lazy(() => import("@/features/part/components/detail/MainboardFanConnector")),
  [Infos.RAM_SPEC]: lazy(() => import("@/features/part/components/detail/RAMSpec")),
  [Infos.SSD_SPEC]: lazy(() => import("@/features/part/components/detail/SSDSpec")),
  [Infos.HDD_SPEC]: lazy(() => import("@/features/part/components/detail/HDDSpec")),
  [Infos.STORAGE_PERF]: lazy(() => import("@/features/part/components/detail/StoragePerformance")),
  [Infos.STORAGE_CACHE]: lazy(() => import("@/features/part/components/detail/StorageCache")),
  [Infos.PSU_SPEC]: lazy(() => import("@/features/part/components/detail/PSUSpec")),
  [Infos.CASE_SPEC]: lazy(() => import("@/features/part/components/detail/CaseSpec")),
  [Infos.CASE_MAIN]: lazy(() => import("@/features/part/components/detail/CaseMainboardSupport")),
  [Infos.CASE_FAN]: lazy(() => import("@/features/part/components/detail/CaseFanSupport")),
  [Infos.CASE_HARD_DRIVE]: lazy(
    () => import("@/features/part/components/detail/CaseHardDriveSupport")
  ),
  [Infos.CASE_RADIATOR]: lazy(
    () => import("@/features/part/components/detail/CaseRadiatorSupport")
  ),
  [Infos.CASE_PSU]: lazy(() => import("@/features/part/components/detail/CasePSUSupport")),
  [Infos.FAN_SPEC]: lazy(() => import("@/features/part/components/detail/FanSpec")),
  [Infos.CPU_BLOCK_SPEC]: lazy(() => import("@/features/part/components/detail/CPUBlockSpec")),
  [Infos.CPU_BLOCK_SOCKET]: lazy(
    () => import("@/features/part/components/detail/CPUBlockSocketSupport")
  ),
  [Infos.PUMP_SPEC]: lazy(() => import("@/features/part/components/detail/PumpSpec")),
  [Infos.RADIATOR_SPEC]: lazy(() => import("@/features/part/components/detail/RadiatorSpec")),
  [Infos.EXTERNAL_PORTS]: lazy(() => import("@/features/part/components/detail/PartExternalPorts")),
  [Infos.PSU_CONNECTOR]: lazy(() => import("@/features/part/components/detail/PSUConnector")),
} as const;

export function InfoTable<Info extends Infos>({
  info,
  defaultValue,
}: Readonly<{
  info: Infos;
  defaultValue?: Part.Model[Info];
}>) {
  const Component = DetailTableComponent[info] as InfoTableComponent<Info>;

  if (!defaultValue || (Array.isArray(defaultValue) && defaultValue.length === 0) || !Component)
    return undefined;

  return (
    <ColumnWrapper className="gap-4 text-wrap rounded-2xl border border-border bg-card p-4">
      <h1 className="text-2xl font-bold">{Information.Label[info]}</h1>
      <Component key={info} defaultValue={defaultValue} />
    </ColumnWrapper>
  );
}
