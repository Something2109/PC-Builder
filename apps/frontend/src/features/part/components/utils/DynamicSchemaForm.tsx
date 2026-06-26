import React from "react";
import { z } from "zod";

import { DynamicArrayForm } from "./DynamicArrayForm";
import { DynamicObjectForm } from "./DynamicObjectForm";

interface DynamicSchemaFormProps<
  T extends Record<string, unknown> | null | undefined | (Record<string, unknown> | null | undefined)[] = Record<string, unknown>,
> {
  schema: z.ZodTypeAny;
  labels: Record<string, string>;
  pending: boolean;
  defaultValue: T;
  onSubmit: (value: T) => void;
  multiple?: boolean;
  group?: string[];
}

export function DynamicSchemaForm<
  T extends Record<string, unknown> | null | undefined | (Record<string, unknown> | null | undefined)[] = Record<string, unknown>,
>({
  schema,
  labels,
  pending,
  defaultValue,
  onSubmit,
  multiple,
  group,
}: DynamicSchemaFormProps<T>) {
  const schemaName = schema?.constructor?.name;

  const isMultiple = multiple || schemaName === "ZodArray";

  if (isMultiple) {
    const elementSchema = (
      schemaName === "ZodArray"
        ? (schema as z.ZodArray<z.ZodTypeAny>).element
        : schema
    ) as z.ZodObject<z.ZodRawShape>;

    return (
      <DynamicArrayForm
        elementSchema={elementSchema}
        labels={labels}
        pending={pending}
        defaultValue={(defaultValue || []) as Record<string, unknown>[]}
        onSubmit={onSubmit as unknown as (value: Record<string, unknown>[]) => void}
        group={group}
      />
    );
  }

  if (schemaName === "ZodObject") {
    return (
      <DynamicObjectForm
        schema={schema as z.ZodObject<z.ZodRawShape>}
        labels={labels}
        pending={pending}
        defaultValue={defaultValue as Record<string, unknown>}
        onSubmit={onSubmit as unknown as (value: Record<string, unknown>) => void}
      />
    );
  }

  return <p className="text-red-500">Unsupported spec schema type.</p>;
}
