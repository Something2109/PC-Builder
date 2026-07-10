"use client";

import Part, { Information } from "@pc-builder/shared/part";
import { lazy, LazyExoticComponent, Suspense, startTransition } from "react";
import { z } from "zod";

import { useInfoAction } from "@/features/part/hooks/InfoAction";
import { VerticalCollapsible } from "@/ui/Collapsible";
import { LoadingSpinner } from "@/ui/LoadingSpinner";
import { NotificationBar } from "@/ui/NotificationBar";

import { DynamicSchemaForm } from "./utils/DynamicSchemaForm";
import { InputFormComponent } from "./utils/TanstackForm";

const InputComponent: Partial<{
  [key in Information.Name]: LazyExoticComponent<
    InputFormComponent<NonNullable<z.infer<Information.DTO[key]>>>
  >;
}> = {
  [Information.Name.CPU_CORES]: lazy(
    () => import("@/features/part/components/input/CPUCoreConfig")
  ),
  [Information.Name.CPU_MEMORY]: lazy(() => import("@/features/part/components/input/CPUMemory")),
  [Information.Name.GRAPHIC_CARD_PORT]: lazy(
    () => import("@/features/part/components/input/GraphicCardPort")
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
  [Information.Name.PSU_CONNECTOR]: lazy(
    () => import("@/features/part/components/input/PSUConnector")
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
  [Information.Name.CPU_BLOCK_SOCKET]: lazy(
    () => import("@/features/part/components/input/CPUBlockSocketSupport")
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
  const [formValue, save, pending, error, setError] = useInfoAction(path, info, defaultValue);

  const infoSchema = Information.Schemas[info]?.Info;
  if (!infoSchema) return undefined;

  const isMultiple = Information.DTO[info] instanceof z.ZodArray;

  return (
    <div className="flex flex-col gap-3 w-full">
      {formValue ? (
        <VerticalCollapsible className="w-full" open>
          <h4 className="text-lg font-bold text-text/90 tracking-wide">
            {Information.Label[info]}
          </h4>
          <div className="pt-3">
            {isMultiple ? (
              (() => {
                const Component = InputComponent[info] as unknown as React.ComponentType<{
                  pending: boolean;
                  onSubmit: (value: unknown) => void;
                  defaultValue: unknown;
                }>;
                if (!Component) return null;
                return (
                  <Suspense fallback={<LoadingSpinner text="loading form specifications..." />}>
                    <Component
                      pending={pending}
                      onSubmit={save as unknown as (value: unknown) => void}
                      defaultValue={formValue}
                    />
                  </Suspense>
                );
              })()
            ) : (
              <DynamicSchemaForm
                schema={infoSchema}
                labels={Information.Labels[info] || {}}
                pending={pending}
                defaultValue={formValue as Record<string, unknown>}
                onSubmit={save as unknown as (value: Record<string, unknown>) => void}
              />
            )}
          </div>
        </VerticalCollapsible>
      ) : (
        <button
          type="button"
          className="w-full py-3.5 px-4 rounded-xl border border-dashed border-border/80 hover:border-accent-indigo text-text/60 hover:text-accent-indigo hover:bg-accent-indigo/5 font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          onClick={() => startTransition(() => save({}))}
          disabled={pending}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {pending
            ? `Adding ${Information.Label[info]}...`
            : `Add ${Information.Label[info]} Specs`}
        </button>
      )}
      {error ? (
        <div className="mt-2">
          <NotificationBar message={error} remove={() => setError(null)} alert />
        </div>
      ) : undefined}
    </div>
  );
}
