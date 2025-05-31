"use client";

import { ColumnWrapper } from "../utils/FlexWrapper";
import { Information } from "@/utils/interface/part";
import { Infos } from "@/utils/Enum";
import { lazy, LazyExoticComponent } from "react";

export const DetailTableComponent: {
  [key in Infos]: LazyExoticComponent<React.FC<any>>;
} = {
  [Infos.CPU_SPEC]: lazy(() => import("@/components/part/detail/CPUSpec")),
  [Infos.CPU_PERF]: lazy(
    () => import("@/components/part/detail/CPUPerformance")
  ),
  [Infos.CPU_CORES]: lazy(
    () => import("@/components/part/detail/CPUCoreConfig")
  ),
  [Infos.CPU_MEMORY]: lazy(() => import("@/components/part/detail/CPUMemory")),
  [Infos.GPU_SPEC]: lazy(() => import("@/components/part/detail/GPUSpec")),
  [Infos.GPU_PERF]: lazy(
    () => import("@/components/part/detail/GPUPerformance")
  ),
  [Infos.GPU_FEAT]: lazy(() => import("@/components/part/detail/GPUFeature")),
  [Infos.GPU_MEMORY]: lazy(() => import("@/components/part/detail/CPUMemory")),
  [Infos.PROCESSOR_CACHE]: lazy(
    () => import("@/components/part/detail/ProcessorCache")
  ),
  [Infos.GRAPHIC_CARD_SPEC]: lazy(
    () => import("@/components/part/detail/GraphicCardSpec")
  ),
  [Infos.GRAPHIC_CARD_PORT]: lazy(
    () => import("@/components/part/detail/GraphicCardPort")
  ),
  [Infos.MAIN_SPEC]: lazy(
    () => import("@/components/part/detail/MainboardSpec")
  ),
  [Infos.MAIN_POWER]: lazy(
    () => import("@/components/part/detail/MainboardPowerConnector")
  ),
  [Infos.MAIN_PCIE]: lazy(
    () => import("@/components/part/detail/MainboardPCIe")
  ),
  [Infos.MAIN_STORAGE]: lazy(
    () => import("@/components/part/detail/MainboardStorageConnector")
  ),
  [Infos.MAIN_USB]: lazy(
    () => import("@/components/part/detail/MainboardUSBConnector")
  ),
  [Infos.MAIN_FAN]: lazy(
    () => import("@/components/part/detail/MainboardFanConnector")
  ),
  [Infos.RAM_SPEC]: lazy(() => import("@/components/part/detail/RAMSpec")),
  [Infos.SSD_SPEC]: lazy(() => import("@/components/part/detail/SSDSpec")),
  [Infos.HDD_SPEC]: lazy(() => import("@/components/part/detail/HDDSpec")),
  [Infos.STORAGE_PERF]: lazy(
    () => import("@/components/part/detail/StoragePerformance")
  ),
  [Infos.STORAGE_CACHE]: lazy(
    () => import("@/components/part/detail/StorageCache")
  ),
  [Infos.PSU_SPEC]: lazy(() => import("@/components/part/detail/PSUSpec")),
  [Infos.CASE_SPEC]: lazy(() => import("@/components/part/detail/CaseSpec")),
  [Infos.CASE_MAIN]: lazy(
    () => import("@/components/part/detail/CaseMainboardSupport")
  ),
  [Infos.CASE_FAN]: lazy(
    () => import("@/components/part/detail/CaseFanSupport")
  ),
  [Infos.CASE_HARD_DRIVE]: lazy(
    () => import("@/components/part/detail/CaseHardDriveSupport")
  ),
  [Infos.CASE_RADIATOR]: lazy(
    () => import("@/components/part/detail/CaseRadiatorSupport")
  ),
  [Infos.CASE_PSU]: lazy(
    () => import("@/components/part/detail/CasePSUSupport")
  ),
  [Infos.FAN_SPEC]: lazy(() => import("@/components/part/detail/FanSpec")),
  [Infos.CPU_BLOCK_SPEC]: lazy(
    () => import("@/components/part/detail/CPUBlockSpec")
  ),
  [Infos.CPU_BLOCK_SOCKET]: lazy(
    () => import("@/components/part/detail/CPUBlockSocketSupport")
  ),
  [Infos.PUMP_SPEC]: lazy(() => import("@/components/part/detail/PumpSpec")),
  [Infos.RADIATOR_SPEC]: lazy(
    () => import("@/components/part/detail/RadiatorSpec")
  ),
  [Infos.EXTERNAL_PORTS]: lazy(
    () => import("@/components/part/detail/PartExternalPorts")
  ),
  [Infos.PSU_CONNECTOR]: lazy(
    () => import("@/components/part/detail/PSUConnector")
  ),
};

export function InfoTable({
  info,
  defaultValue,
}: {
  info: Infos;
  defaultValue?: any;
}) {
  const Component = DetailTableComponent[info];

  if (
    !defaultValue ||
    (Array.isArray(defaultValue) && defaultValue.length === 0) ||
    !Component
  )
    return undefined;

  return (
    <ColumnWrapper className="text-wrap">
      <h1 className="text-4xl font-bold">{Information.Label[info]}</h1>
      <Component key={info} defaultValue={defaultValue} />
    </ColumnWrapper>
  );
}
