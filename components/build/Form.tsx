"use client";

import { useBuildContext } from "@/components/hook/build/BuildContext";
import { useValidation } from "@/components/hook/build/Validation";
import { Button } from "@/components/utils/Button";

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
