"use client";

import { useValidation } from "@/features/build/hooks/Validation";
import { VerticalCollapsible } from "@/ui/Collapsible";
import { ColumnWrapper } from "@/ui/FlexWrapper";

export default function BuildResultList() {
  const {
    result: { rules },
  } = useValidation();

  return (
    <VerticalCollapsible>
      <h1 className="text-2xl font-bold">Result</h1>
      <ColumnWrapper>
        <h2>Rules</h2>
        <ul>
          {Object.entries(rules).map(
            ([name, { error }]) => error && <li key={`Rule-${name}`}>{`${name}: ${error}`}</li>
          )}
        </ul>
      </ColumnWrapper>
    </VerticalCollapsible>
  );
}
