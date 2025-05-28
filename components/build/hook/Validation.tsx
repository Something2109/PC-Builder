"use client";

import Build from "@/utils/interface/build";
import { useActionState } from "react";

function useValidateAction() {
  const [state, setState, pending] = useActionState<
    Build.Result | null,
    Build.List
  >(async (_, list) => {
    const response = await fetch(`/api/build/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(list),
    });

    if (!response.ok) return null;

    const result = await response.json();

    return result;
  }, null);

  return [state, setState, pending] as const;
}

export { useValidateAction };
