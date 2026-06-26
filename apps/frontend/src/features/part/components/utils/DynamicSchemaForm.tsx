import React from "react";
import { z } from "zod";

import { DynamicObjectForm } from "./DynamicObjectForm";

interface DynamicSchemaFormProps<T extends Record<string, unknown> = Record<string, unknown>> {
  schema: z.ZodTypeAny;
  labels: Record<string, string>;
  pending: boolean;
  defaultValue: T;
  onSubmit: (value: T) => void;
}

export function DynamicSchemaForm<T extends Record<string, unknown> = Record<string, unknown>>({
  schema,
  labels,
  pending,
  defaultValue,
  onSubmit,
}: DynamicSchemaFormProps<T>) {
  const schemaName = schema?.constructor?.name;

  if (schemaName === "ZodObject") {
    return (
      <DynamicObjectForm<T>
        schema={schema as z.ZodObject<z.ZodRawShape>}
        labels={labels}
        pending={pending}
        defaultValue={defaultValue}
        onSubmit={onSubmit}
      />
    );
  }

  return <p className="text-red-500">Unsupported spec schema type.</p>;
}
