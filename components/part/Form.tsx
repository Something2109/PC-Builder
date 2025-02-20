"use client";

import { Button } from "@/components/utils/Button";
import { RowWrapper } from "@/components/utils/FlexWrapper";
import { Information } from "@/utils/interface/info";
import { Infos } from "@/utils/Enum";
import React, { lazy, useActionState, useRef, useState } from "react";
import { DetailInfo } from "@/utils/interface";
import { NotificationBar } from "../utils/NotificationBar";

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
  defaultValue?: Partial<DetailInfo[typeof info]>;
}) {
  const label = useRef(Information.Label[info]);
  const [error, setError] = useState<string | null>(null);
  const [formValue, save, pending] = useActionState<
    Partial<DetailInfo[typeof info]>,
    Partial<DetailInfo[typeof info]>
  >(async (prev, data) => {
    const operation = prev ? (data ? "save" : "delete") : "add";

    setError(null);
    if (
      !confirm(`Are you sure you want to ${operation} ${label.current} info?`)
    )
      return prev;

    const body = JSON.stringify({ [info]: data });

    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (!response.ok) {
      setError((await response.json()).message);
      return prev;
    } else {
      alert(`Successfully ${operation} ${label.current} info.`);
    }

    const newData = (await response.json()) as DetailInfo;

    return newData[info];
  }, defaultValue);

  const Component = InputComponent[info];

  if (!Component) return undefined;

  if (!formValue) {
    return (
      <form className="flex flex-col gap-1">
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
        {error ? (
          <NotificationBar
            message={error}
            remove={() => setError(null)}
            alert
          />
        ) : undefined}
      </form>
    );
  }

  return (
    <form className="flex flex-col gap-1">
      <RowWrapper className="sticky top-32 justify-between items-center">
        <h1 className="text-4xl font-bold">{label.current}</h1>
        {!pending && (
          <Button type="submit" formAction={() => save(null)}>
            Delete
          </Button>
        )}
      </RowWrapper>
      <Component
        pending={pending}
        onSubmit={save}
        defaultValue={formValue as any}
      />
      {error ? (
        <NotificationBar message={error} remove={() => setError(null)} alert />
      ) : undefined}
    </form>
  );
}
