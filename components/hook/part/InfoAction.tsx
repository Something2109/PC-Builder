"use client";

import Part, { Information } from "@/utils/interface/part";
import { Infos } from "@/utils/Enum";
import { useRef, useActionState, useState } from "react";

export function useInfoAction(
  path: string,
  info: Infos,
  defaultValue: Part.DTO
) {
  const label = useRef(Information.Label[info]);
  const [error, setError] = useState<string | null>(null);
  const [formValue, save, pending] = useActionState<
    Partial<Part.DTO[typeof info]> | null,
    Partial<Part.DTO[typeof info]> | null
  >(async (prev, data) => {
    const operation = prev ? (data ? "save" : "delete") : "add";
    const body = JSON.stringify({ [info]: data });

    setError(null);
    if (
      !confirm(`Are you sure you want to ${operation} ${label.current} info?`)
    )
      return prev;

    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (!response.ok) {
      setError((await response.json()).message);
      return prev;
    }

    const newData = (await response.json()) as Part.DTO;

    alert(`Successfully ${operation} ${label.current} info.`);

    return newData[info];
  }, defaultValue[info]);

  return [formValue, save, pending, error, setError] as const;
}
