"use client";

import { Button } from "@/components/utils/Button";
import { RowWrapper } from "@/components/utils/FlexWrapper";
import { Info } from "@/utils/Enum";
import React, { lazy, useCallback, useState } from "react";
import { DetailInfo, InfoLabels } from "@/utils/interface";
import { NotificationBar } from "../utils/NotificationBar";

const InputComponent = {
  [Info.CPU]: lazy(() => import("@/components/part/input/CPU")),
  [Info.GPU]: lazy(() => import("@/components/part/input/GPU")),
  [Info.GRAPHIC_CARD]: lazy(
    () => import("@/components/part/input/GraphicCard")
  ),
  [Info.MAIN]: lazy(() => import("@/components/part/input/Mainboard")),
  [Info.RAM]: lazy(() => import("@/components/part/input/RAM")),
  [Info.HDD]: lazy(() => import("@/components/part/input/HDD")),
  [Info.PSU]: lazy(() => import("@/components/part/input/PSU")),
  [Info.CASE]: lazy(() => import("@/components/part/input/Case")),
  [Info.COOLER]: lazy(() => import("@/components/part/input/Cooler")),
  [Info.AIO]: lazy(() => import("@/components/part/input/AIO")),
  [Info.FAN]: lazy(() => import("@/components/part/input/Fan")),
  [Info.SSD]: lazy(() => import("@/components/part/input/SSD")),
  [Info.CPU_BLOCK]: lazy(() => import("@/components/part/input/CPUBlock")),
  [Info.PUMP]: lazy(() => import("@/components/part/input/Pump")),
  [Info.RADIATOR]: lazy(() => import("@/components/part/input/Radiator")),
};

export type FormContainer = {
  [key in Info]?: boolean;
};

export function InfoForm({
  path,
  info,
  defaultValue,
  remove,
}: {
  path: string;
  info: Info;
  defaultValue?: any;
  remove: (info: Info) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const save = useCallback(
    async (data: Partial<DetailInfo[typeof info]> | null) => {
      const body = JSON.stringify({ [info]: data });

      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!response.ok) {
        setError((await response.json()).message);
      }

      return false;
    },
    [defaultValue]
  );

  const Component = InputComponent[info];

  if (!Component) return undefined;

  return (
    <form className="flex flex-col gap-1">
      <RowWrapper className="sticky top-32 justify-between items-center">
        <h1 className="text-4xl font-bold">{InfoLabels[info]}</h1>
        <Button
          type="submit"
          formAction={async () => (await save(null)) && remove(info)}
        >
          Delete
        </Button>
      </RowWrapper>
      <Component onSubmit={save} defaultValue={defaultValue} />
      {error ? (
        <NotificationBar message={error} remove={() => setError(null)} alert />
      ) : undefined}
    </form>
  );
}
