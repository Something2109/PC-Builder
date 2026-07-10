"use client";

import Part, { Information, Infos } from "@pc-builder/shared/part";
import { lazy, LazyExoticComponent, Suspense } from "react";
import { z } from "zod";

import { VerticalCollapsible } from "@/components/ui/Collapsible";
import { LoadingSpinner } from "@/ui/LoadingSpinner";

import { DynamicSchemaDisplay } from "./utils/DynamicSchemaDisplay";

type InfoTableComponent<T extends Infos> = React.FC<{
  defaultValue: Part.Model[T];
}>;

export const DetailTableComponent: Partial<{
  [key in Infos]: LazyExoticComponent<InfoTableComponent<key>>;
}> = {
  [Infos.CPU_CORES]: lazy(() => import("@/features/part/components/detail/CPUCoreConfig")),
  [Infos.CPU_MEMORY]: lazy(() => import("@/features/part/components/detail/CPUMemory")),
  [Infos.GRAPHIC_CARD_PORT]: lazy(
    () => import("@/features/part/components/detail/GraphicCardPort")
  ),
  [Infos.MAIN_POWER]: lazy(
    () => import("@/features/part/components/detail/MainboardPowerConnector")
  ),
  [Infos.MAIN_PCIE]: lazy(() => import("@/features/part/components/detail/MainboardPCIe")),
  [Infos.MAIN_STORAGE]: lazy(
    () => import("@/features/part/components/detail/MainboardStorageConnector")
  ),
  [Infos.MAIN_USB]: lazy(() => import("@/features/part/components/detail/MainboardUSBConnector")),
  [Infos.MAIN_FAN]: lazy(() => import("@/features/part/components/detail/MainboardFanConnector")),
  [Infos.CASE_MAIN]: lazy(() => import("@/features/part/components/detail/CaseMainboardSupport")),
  [Infos.CASE_FAN]: lazy(() => import("@/features/part/components/detail/CaseFanSupport")),
  [Infos.CASE_HARD_DRIVE]: lazy(
    () => import("@/features/part/components/detail/CaseHardDriveSupport")
  ),
  [Infos.CASE_RADIATOR]: lazy(
    () => import("@/features/part/components/detail/CaseRadiatorSupport")
  ),
  [Infos.CASE_PSU]: lazy(() => import("@/features/part/components/detail/CasePSUSupport")),
  [Infos.CPU_BLOCK_SOCKET]: lazy(
    () => import("@/features/part/components/detail/CPUBlockSocketSupport")
  ),
  [Infos.EXTERNAL_PORTS]: lazy(() => import("@/features/part/components/detail/PartExternalPorts")),
  [Infos.PSU_CONNECTOR]: lazy(() => import("@/features/part/components/detail/PSUConnector")),
};

export function InfoTable<Info extends Infos>({
  info,
  defaultValue,
}: Readonly<{
  info: Infos;
  defaultValue?: Part.Model[Info];
}>) {
  if (!defaultValue || (Array.isArray(defaultValue) && defaultValue.length === 0)) return undefined;

  const isMultiple = Information.DTO[info] instanceof z.ZodArray;

  return (
    <VerticalCollapsible className="gap-4 text-wrap rounded-2xl border border-border bg-card p-4">
      <h4 className="text-lg font-bold text-text/90 tracking-wide">{Information.Label[info]}</h4>
      <div className="pt-3">
        {isMultiple ? (
          (() => {
            const Component = DetailTableComponent[info] as InfoTableComponent<Info>;
            if (!Component) return null;
            return (
              <Suspense fallback={<LoadingSpinner text="loading specifications table..." />}>
                <Component key={info} defaultValue={defaultValue} />
              </Suspense>
            );
          })()
        ) : (
          <DynamicSchemaDisplay
            schema={Information.Schemas[info]?.Info}
            labels={Information.Labels[info] || {}}
            defaultValue={defaultValue}
          />
        )}
      </div>
    </VerticalCollapsible>
  );
}
