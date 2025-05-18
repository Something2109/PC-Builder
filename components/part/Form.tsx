"use client";

import { useInfoAction } from "./utils/Hook";
import { NotificationBar } from "../utils/NotificationBar";
import { VerticalCollapsible } from "../utils/Collapsible";
import { Button } from "@/components/utils/Button";
import { Information } from "@/utils/interface/part";
import Part from "@/utils/interface/part";
import { Infos } from "@/utils/Enum";
import { lazy, LazyExoticComponent, useRef } from "react";

const InputComponent: {
  [key in Infos]: LazyExoticComponent<React.FC<any>>;
} = {
  [Infos.CPU_SPEC]: lazy(() => import("@/components/part/input/CPUSpec")),
  [Infos.CPU_PERF]: lazy(
    () => import("@/components/part/input/CPUPerformance")
  ),
  [Infos.CPU_CORES]: lazy(
    () => import("@/components/part/input/CPUCoreConfig")
  ),
  [Infos.CPU_MEMORY]: lazy(() => import("@/components/part/input/CPUMemory")),
  [Infos.GPU_SPEC]: lazy(() => import("@/components/part/input/GPUSpec")),
  [Infos.GPU_PERF]: lazy(
    () => import("@/components/part/input/GPUPerformance")
  ),
  [Infos.GPU_MEMORY]: lazy(() => import("@/components/part/input/GPUMemory")),
  [Infos.GPU_FEAT]: lazy(() => import("@/components/part/input/GPUFeature")),
  [Infos.PROCESSOR_CACHE]: lazy(
    () => import("@/components/part/input/ProcessorCache")
  ),
  [Infos.GRAPHIC_CARD_SPEC]: lazy(
    () => import("@/components/part/input/GraphicCardSpec")
  ),
  [Infos.GRAPHIC_CARD_PORT]: lazy(
    () => import("@/components/part/input/GraphicCardPort")
  ),
  [Infos.MAIN_SPEC]: lazy(
    () => import("@/components/part/input/MainboardSpec")
  ),
  [Infos.MAIN_POWER]: lazy(
    () => import("@/components/part/input/MainboardPowerConnector")
  ),
  [Infos.MAIN_PCIE]: lazy(
    () => import("@/components/part/input/MainboardPCIe")
  ),
  [Infos.MAIN_STORAGE]: lazy(
    () => import("@/components/part/input/MainboardStorageConnector")
  ),
  [Infos.MAIN_USB]: lazy(
    () => import("@/components/part/input/MainboardUSBConnector")
  ),
  [Infos.MAIN_FAN]: lazy(
    () => import("@/components/part/input/MainboardFanConnector")
  ),
  [Infos.RAM_SPEC]: lazy(() => import("@/components/part/input/RAMSpec")),
  [Infos.SSD_SPEC]: lazy(() => import("@/components/part/input/SSDSpec")),
  [Infos.HDD_SPEC]: lazy(() => import("@/components/part/input/HDDSpec")),
  [Infos.STORAGE_PERF]: lazy(
    () => import("@/components/part/input/StoragePerformance")
  ),
  [Infos.STORAGE_CACHE]: lazy(
    () => import("@/components/part/input/StorageCache")
  ),
  [Infos.PSU_SPEC]: lazy(() => import("@/components/part/input/PSUSpec")),
  [Infos.PSU_CONNECTOR]: lazy(
    () => import("@/components/part/input/PSUConnector")
  ),
  [Infos.CASE_SPEC]: lazy(() => import("@/components/part/input/CaseSpec")),
  [Infos.CASE_MAIN]: lazy(
    () => import("@/components/part/input/CaseMainboardSupport")
  ),
  [Infos.CASE_FAN]: lazy(
    () => import("@/components/part/input/CaseFanSupport")
  ),
  [Infos.CASE_HARD_DRIVE]: lazy(
    () => import("@/components/part/input/CaseHardDriveSupport")
  ),
  [Infos.CASE_RADIATOR]: lazy(
    () => import("@/components/part/input/CaseRadiatorSupport")
  ),
  [Infos.CASE_PSU]: lazy(
    () => import("@/components/part/input/CasePSUSupport")
  ),
  [Infos.FAN_SPEC]: lazy(() => import("@/components/part/input/FanSpec")),
  [Infos.CPU_BLOCK_SPEC]: lazy(
    () => import("@/components/part/input/CPUBlockSpec")
  ),
  [Infos.CPU_BLOCK_SOCKET]: lazy(
    () => import("@/components/part/input/CPUBlockSocketSupport")
  ),
  [Infos.PUMP_SPEC]: lazy(() => import("@/components/part/input/PumpSpec")),
  [Infos.RADIATOR_SPEC]: lazy(
    () => import("@/components/part/input/RadiatorSpec")
  ),
  [Infos.EXTERNAL_PORTS]: lazy(
    () => import("@/components/part/input/PartExternalPorts")
  ),
};

export function InfoForm({
  path,
  info,
  defaultValue,
}: {
  path: string;
  info: Infos;
  defaultValue: Part.Detail;
}) {
  const label = useRef(Information.Label[info]);
  const [formValue, save, pending, error, setError] = useInfoAction(
    path,
    info,
    defaultValue
  );

  const Component = InputComponent[info];

  if (!Component) return undefined;

  return (
    <form className="flex flex-col gap-1">
      {formValue ? (
        <VerticalCollapsible className="sticky top-32">
          <h1 className="text-4xl font-bold">{label.current}</h1>
          <Component
            pending={pending}
            onSubmit={save}
            defaultValue={formValue as any}
          />
        </VerticalCollapsible>
      ) : (
        <Button
          type="submit"
          className="w-full"
          formAction={() => save({})}
          disabled={pending}
        >
          {pending
            ? `Adding ${label.current} ...`
            : `Add ${label.current} Info`}
        </Button>
      )}
      {error ? (
        <NotificationBar message={error} remove={() => setError(null)} alert />
      ) : undefined}
    </form>
  );
}
