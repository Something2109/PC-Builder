import React from "react";
import { z } from "zod";

import { SuffixDisplay, UnitDisplay } from "@/ui/Display";

import { inspectFieldSchema } from "./schemaInspector";

interface DynamicFieldDisplayProps {
  schema: z.ZodTypeAny;
  value: unknown;
}

export function DynamicFieldDisplay({ schema, value }: DynamicFieldDisplayProps) {
  if (value === undefined || value === null) {
    return <span className="text-text/40">-</span>;
  }

  const fieldConfig = inspectFieldSchema(schema);

  switch (fieldConfig.type) {
    case "number":
      if (fieldConfig.unitConfig) {
        return (
          <UnitDisplay
            Unit={fieldConfig.unitConfig.unit}
            defaultUnit={fieldConfig.unitConfig.target}
            defaultValue={value as number}
          />
        );
      }

      if (fieldConfig.suffixConfig) {
        return (
          <SuffixDisplay suffix={fieldConfig.suffixConfig.suffix}>{value as number}</SuffixDisplay>
        );
      }

      return <span>{value as number}</span>;

    case "boolean":
      return (
        <span
          className={`inline-flex px-2 py-0.5 text-xs font-bold rounded-md ${
            value ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          }`}
        >
          {value ? "Yes" : "No"}
        </span>
      );

    case "enum":
    case "string":
    default:
      return <span>{String(value)}</span>;
  }
}
