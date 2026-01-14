"use client";

import { NotificationBar } from "../utils/NotificationBar";
import { VerticalCollapsible } from "../utils/Collapsible";
import { useInfoAction } from "@/components/hook/part/InfoAction";
import { Button } from "@/components/utils/Button";
import Part, { Information } from "@/utils/part";
import { lazy, LazyExoticComponent } from "react";

const InputComponent: {
  [key in Information.Name]: LazyExoticComponent<React.FC<any>>;
} = {
  [Information.Name.CPU_SPEC]: lazy(
    () => import("@/components/part/input/CPUSpec")
  ),
  [Information.Name.CPU_PERF]: lazy(
    () => import("@/components/part/input/CPUPerformance")
  ),
  [Information.Name.CPU_CORES]: lazy(
    () => import("@/components/part/input/CPUCoreConfig")
  ),
  [Information.Name.CPU_MEMORY]: lazy(
    () => import("@/components/part/input/CPUMemory")
  ),
  [Information.Name.GPU_SPEC]: lazy(
    () => import("@/components/part/input/GPUSpec")
  ),
  [Information.Name.GPU_PERF]: lazy(
    () => import("@/components/part/input/GPUPerformance")
  ),
  [Information.Name.GPU_MEMORY]: lazy(
    () => import("@/components/part/input/GPUMemory")
  ),
  [Information.Name.GPU_FEAT]: lazy(
    () => import("@/components/part/input/GPUFeature")
  ),
  [Information.Name.PROCESSOR_CACHE]: lazy(
    () => import("@/components/part/input/ProcessorCache")
  ),
  [Information.Name.GRAPHIC_CARD_SPEC]: lazy(
    () => import("@/components/part/input/GraphicCardSpec")
  ),
  [Information.Name.GRAPHIC_CARD_PORT]: lazy(
    () => import("@/components/part/input/GraphicCardPort")
  ),
  [Information.Name.MAIN_SPEC]: lazy(
    () => import("@/components/part/input/MainboardSpec")
  ),
  [Information.Name.MAIN_POWER]: lazy(
    () => import("@/components/part/input/MainboardPowerConnector")
  ),
  [Information.Name.MAIN_PCIE]: lazy(
    () => import("@/components/part/input/MainboardPCIe")
  ),
  [Information.Name.MAIN_STORAGE]: lazy(
    () => import("@/components/part/input/MainboardStorageConnector")
  ),
  [Information.Name.MAIN_USB]: lazy(
    () => import("@/components/part/input/MainboardUSBConnector")
  ),
  [Information.Name.MAIN_FAN]: lazy(
    () => import("@/components/part/input/MainboardFanConnector")
  ),
  [Information.Name.RAM_SPEC]: lazy(
    () => import("@/components/part/input/RAMSpec")
  ),
  [Information.Name.SSD_SPEC]: lazy(
    () => import("@/components/part/input/SSDSpec")
  ),
  [Information.Name.HDD_SPEC]: lazy(
    () => import("@/components/part/input/HDDSpec")
  ),
  [Information.Name.STORAGE_PERF]: lazy(
    () => import("@/components/part/input/StoragePerformance")
  ),
  [Information.Name.STORAGE_CACHE]: lazy(
    () => import("@/components/part/input/StorageCache")
  ),
  [Information.Name.PSU_SPEC]: lazy(
    () => import("@/components/part/input/PSUSpec")
  ),
  [Information.Name.PSU_CONNECTOR]: lazy(
    () => import("@/components/part/input/PSUConnector")
  ),
  [Information.Name.CASE_SPEC]: lazy(
    () => import("@/components/part/input/CaseSpec")
  ),
  [Information.Name.CASE_MAIN]: lazy(
    () => import("@/components/part/input/CaseMainboardSupport")
  ),
  [Information.Name.CASE_FAN]: lazy(
    () => import("@/components/part/input/CaseFanSupport")
  ),
  [Information.Name.CASE_HARD_DRIVE]: lazy(
    () => import("@/components/part/input/CaseHardDriveSupport")
  ),
  [Information.Name.CASE_RADIATOR]: lazy(
    () => import("@/components/part/input/CaseRadiatorSupport")
  ),
  [Information.Name.CASE_PSU]: lazy(
    () => import("@/components/part/input/CasePSUSupport")
  ),
  [Information.Name.FAN_SPEC]: lazy(
    () => import("@/components/part/input/FanSpec")
  ),
  [Information.Name.CPU_BLOCK_SPEC]: lazy(
    () => import("@/components/part/input/CPUBlockSpec")
  ),
  [Information.Name.CPU_BLOCK_SOCKET]: lazy(
    () => import("@/components/part/input/CPUBlockSocketSupport")
  ),
  [Information.Name.PUMP_SPEC]: lazy(
    () => import("@/components/part/input/PumpSpec")
  ),
  [Information.Name.RADIATOR_SPEC]: lazy(
    () => import("@/components/part/input/RadiatorSpec")
  ),
  [Information.Name.EXTERNAL_PORTS]: lazy(
    () => import("@/components/part/input/PartExternalPorts")
  ),
};

export function InfoForm({
  path,
  info,
  defaultValue,
}: Readonly<{
  path: string;
  info: Information.Name;
  defaultValue: Part.DTO;
}>) {
  const [formValue, save, pending, error, setError] = useInfoAction(
    path,
    info,
    defaultValue
  );

  const Component = InputComponent[info];

  if (!Component) return undefined;

  return (
    <form className="flex flex-col gap-1 w-full">
      {formValue ? (
        <VerticalCollapsible className="sticky top-32">
          <h1 className="text-4xl font-bold">{Information.Label[info]}</h1>
          <Component
            pending={pending}
            onSubmit={save}
            defaultValue={formValue}
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
            ? `Adding ${Information.Label[info]} ...`
            : `Add ${Information.Label[info]} Info`}
        </Button>
      )}
      {error ? (
        <NotificationBar message={error} remove={() => setError(null)} alert />
      ) : undefined}
    </form>
  );
}
