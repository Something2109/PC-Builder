"use client";

import { Button } from "@/components/utils/Button";
import { Information } from "@/utils/interface/part";
import { Infos } from "@/utils/Enum";
import React, { lazy, useRef } from "react";
import Part from "@/utils/interface/part";
import { NotificationBar } from "../utils/NotificationBar";
import { VerticalCollapsible } from "../utils/Collapsible";
import { useInfoAction } from "./utils/Form";

const InputComponent = {
  [Infos.CPU]: lazy(() => import("@/components/part/input/CPU")),
  [Infos.GPU]: lazy(() => import("@/components/part/input/GPU")),
  [Infos.GRAPHIC_CARD]: lazy(
    () => import("@/components/part/input/GraphicCard")
  ),
  [Infos.MAIN]: lazy(() => import("@/components/part/input/Mainboard")),
  [Infos.RAM]: lazy(() => import("@/components/part/input/RAM")),
  [Infos.HDD]: lazy(() => import("@/components/part/input/HDD")),
  [Infos.PSU]: lazy(() => import("@/components/part/input/PSU")),
  [Infos.CASE]: lazy(() => import("@/components/part/input/Case")),
  [Infos.COOLER]: lazy(() => import("@/components/part/input/Cooler")),
  [Infos.AIO]: lazy(() => import("@/components/part/input/AIO")),
  [Infos.FAN]: lazy(() => import("@/components/part/input/Fan")),
  [Infos.SSD]: lazy(() => import("@/components/part/input/SSD")),
  [Infos.CPU_BLOCK]: lazy(() => import("@/components/part/input/CPUBlock")),
  [Infos.PUMP]: lazy(() => import("@/components/part/input/Pump")),
  [Infos.RADIATOR]: lazy(() => import("@/components/part/input/Radiator")),
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
