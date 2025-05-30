"use client";

import { useBuildContext } from "./hook/BuildContext";
import { useValidation } from "./hook/Validation";
import { Button } from "../utils/Button";

export default function BuildValidateForm() {
  const { list } = useBuildContext();
  const { validate, pending } = useValidation();

  return (
    <form action={() => validate(list)} className="space-y-4">
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
