"use client";

import { Button } from "@/components/utils/Button";
import { RowWrapper } from "@/components/utils/FlexWrapper";
import { Info as InfoNamespace } from "@/utils/interface/info";
import { Info } from "@/utils/Enum";
import React, { lazy, useActionState, useRef, useState } from "react";
import { DetailInfo } from "@/utils/interface";
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

export function InfoForm({
  path,
  info,
  defaultValue,
}: {
  path: string;
  info: Info;
  defaultValue?: Partial<DetailInfo[typeof info]>;
}) {
  const label = useRef(InfoNamespace.Label[info]);
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
