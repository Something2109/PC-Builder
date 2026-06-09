"use client";

import { lazy, LazyExoticComponent } from "react";

import { useInfoAction } from "@/features/part/hooks/InfoAction";
import { Button } from "@/ui/Button";
import { VerticalCollapsible } from "@/ui/Collapsible";
import { NotificationBar } from "@/ui/NotificationBar";
import Part, { Information } from "@/utils/part";
import { InputFormComponent } from "./utils/TanstackForm";
import z from "zod";

const InputComponent: {
  [key in Information.Name]: LazyExoticComponent<
    InputFormComponent<NonNullable<z.infer<Information.DTO[key]>>>
  >;
} = {
  [Information.Name.CPU_SPEC]: lazy(
    () => import("@/features/part/components/input/CPUSpec")
  ),
  [Information.Name.CPU_PERF]: lazy(
    () => import("@/features/part/components/input/CPUPerformance")
  ),
  [Information.Name.CPU_CORES]: lazy(
    () => import("@/features/part/components/input/CPUCoreConfig")
  ),
  [Information.Name.CPU_MEMORY]: lazy(
    () => import("@/features/part/components/input/CPUMemory")
  ),
  [Information.Name.GPU_SPEC]: lazy(
    () => import("@/features/part/components/input/GPUSpec")
  ),
  [Information.Name.GPU_PERF]: lazy(
    () => import("@/features/part/components/input/GPUPerformance")
  ),
  [Information.Name.GPU_MEMORY]: lazy(
    () => import("@/features/part/components/input/GPUMemory")
  ),
  [Information.Name.GPU_FEAT]: lazy(
    () => import("@/features/part/components/input/GPUFeature")
  ),
  [Information.Name.PROCESSOR_CACHE]: lazy(
    () => import("@/features/part/components/input/ProcessorCache")
  ),
  [Information.Name.GRAPHIC_CARD_SPEC]: lazy(
    () => import("@/features/part/components/input/GraphicCardSpec")
  ),
  [Information.Name.GRAPHIC_CARD_PORT]: lazy(
    () => import("@/features/part/components/input/GraphicCardPort")
  ),
  [Information.Name.MAIN_SPEC]: lazy(
    () => import("@/features/part/components/input/MainboardSpec")
  ),
  [Information.Name.MAIN_POWER]: lazy(
    () => import("@/features/part/components/input/MainboardPowerConnector")
  ),
  [Information.Name.MAIN_PCIE]: lazy(
    () => import("@/features/part/components/input/MainboardPCIe")
  ),
  [Information.Name.MAIN_STORAGE]: lazy(
    () => import("@/features/part/components/input/MainboardStorageConnector")
  ),
  [Information.Name.MAIN_USB]: lazy(
    () => import("@/features/part/components/input/MainboardUSBConnector")
  ),
  [Information.Name.MAIN_FAN]: lazy(
    () => import("@/features/part/components/input/MainboardFanConnector")
  ),
  [Information.Name.RAM_SPEC]: lazy(
    () => import("@/features/part/components/input/RAMSpec")
  ),
  [Information.Name.SSD_SPEC]: lazy(
    () => import("@/features/part/components/input/SSDSpec")
  ),
  [Information.Name.HDD_SPEC]: lazy(
    () => import("@/features/part/components/input/HDDSpec")
  ),
  [Information.Name.STORAGE_PERF]: lazy(
    () => import("@/features/part/components/input/StoragePerformance")
  ),
  [Information.Name.STORAGE_CACHE]: lazy(
    () => import("@/features/part/components/input/StorageCache")
  ),
  [Information.Name.PSU_SPEC]: lazy(
    () => import("@/features/part/components/input/PSUSpec")
  ),
  [Information.Name.PSU_CONNECTOR]: lazy(
    () => import("@/features/part/components/input/PSUConnector")
  ),
  [Information.Name.CASE_SPEC]: lazy(
    () => import("@/features/part/components/input/CaseSpec")
  ),
  [Information.Name.CASE_MAIN]: lazy(
    () => import("@/features/part/components/input/CaseMainboardSupport")
  ),
  [Information.Name.CASE_FAN]: lazy(
    () => import("@/features/part/components/input/CaseFanSupport")
  ),
  [Information.Name.CASE_HARD_DRIVE]: lazy(
    () => import("@/features/part/components/input/CaseHardDriveSupport")
  ),
  [Information.Name.CASE_RADIATOR]: lazy(
    () => import("@/features/part/components/input/CaseRadiatorSupport")
  ),
  [Information.Name.CASE_PSU]: lazy(
    () => import("@/features/part/components/input/CasePSUSupport")
  ),
  [Information.Name.FAN_SPEC]: lazy(
    () => import("@/features/part/components/input/FanSpec")
  ),
  [Information.Name.CPU_BLOCK_SPEC]: lazy(
    () => import("@/features/part/components/input/CPUBlockSpec")
  ),
  [Information.Name.CPU_BLOCK_SOCKET]: lazy(
    () => import("@/features/part/components/input/CPUBlockSocketSupport")
  ),
  [Information.Name.PUMP_SPEC]: lazy(
    () => import("@/features/part/components/input/PumpSpec")
  ),
  [Information.Name.RADIATOR_SPEC]: lazy(
    () => import("@/features/part/components/input/RadiatorSpec")
  ),
  [Information.Name.EXTERNAL_PORTS]: lazy(
    () => import("@/features/part/components/input/PartExternalPorts")
  ),
};

export function InfoForm<Info extends Information.Name>({
  path,
  info,
  defaultValue,
}: Readonly<{
  path: string;
  info: Info;
  defaultValue: Part.DTO;
}>) {
  const [formValue, save, pending, error, setError] = useInfoAction(
    path,
    info,
    defaultValue
  );

  const Component = InputComponent[info] as InputFormComponent<
    NonNullable<Part.DTO[Information.Name]>
  >;

  if (!Component) return undefined;

  return (
    <div className="flex flex-col gap-1 w-full">
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
          type="button"
          className="w-full"
          onClick={() => save({})}
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
    </div>
  );
}
