"use client";

import Part from "@/utils/interface/part";
import { Products } from "@/utils/Enum";
import { useActionState, useState } from "react";

function createPayload(formData: FormData | null) {
  const RequestPayload: RequestInit = {};

  if (formData) {
    const raw = Object.fromEntries(formData.entries()) as any;
    if (!raw.url) raw.url = undefined;
    if (!raw.image_url) raw.image_url = undefined;

    const data = Part.BasicInfo.omit({ id: true, part: true }).parse(raw);
    RequestPayload.method = "POST";
    RequestPayload.headers = { "Content-Type": "application/json" };
    RequestPayload.body = JSON.stringify(data);
  } else {
    RequestPayload.method = "DELETE";
  }

  return RequestPayload;
}

export default function usePartAction(
  path: string,
  part: Products,
  defaultValue?: Part.BasicInfo
) {
  const [error, setError] = useState<string | null>(null);
  const [formValue, save, pending] = useActionState<
    Part.BasicInfo | undefined,
    FormData | null
  >(async (prev, formData) => {
    const operation = prev ? (formData ? "save" : "delete") : "add";
    const RequestPayload: RequestInit = createPayload(formData);

    setError(null);
    if (!confirm(`Are you sure you want to ${operation} basic info?`))
      return prev;

    const response = await fetch(path, RequestPayload);

    if (!response.ok) {
      setError((await response.json()).message);
      return prev;
    }

    const newData = (await response.json()) as Part.BasicInfo;

    alert(`Successfully ${operation} part info.`);

    return newData;
  }, defaultValue);

  return [formValue, save, pending, error, setError] as const;
}
