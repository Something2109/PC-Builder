"use client";

import { useBuildContext } from "./hook/BuildDetail";
import { useValidateAction } from "./hook/Validation";
import { Button } from "../utils/Button";

export default function BuildValidateForm() {
  const { list } = useBuildContext();
  const [state, setState, pending] = useValidateAction();

  return (
    <form action={() => setState(list)} className="space-y-4">
      {pending ? (
        "Validating..."
      ) : (
        <Button type="submit" className="px-4 py-2">
          Validate Build
        </Button>
      )}
    </form>
  );
}
