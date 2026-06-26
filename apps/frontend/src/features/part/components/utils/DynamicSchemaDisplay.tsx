import React from "react";
import { z } from "zod";

import { DynamicFieldDisplay } from "./DynamicFieldDisplay";
import { Table } from "./Table";

interface DynamicSchemaDisplayProps {
  schema: z.ZodTypeAny;
  labels: Record<string, string>;
  defaultValue: unknown;
}

export function DynamicSchemaDisplay({
  schema,
  labels,
  defaultValue,
}: DynamicSchemaDisplayProps) {
  const schemaName = schema?.constructor?.name;

  if (!defaultValue || (Array.isArray(defaultValue) && defaultValue.length === 0)) {
    return <span className="text-text/40">No specifications provided.</span>;
  }

  // ZodObject layout (vertical table)
  if (schemaName === "ZodObject") {
    const objectSchema = schema as z.ZodObject<z.ZodRawShape>;
    const shape = objectSchema.shape;
    const properties = Object.keys(shape);

    return (
      <Table.Component>
        <tbody>
          {properties.map((key) => {
            const value = (defaultValue as Record<string, unknown>)?.[key];
            // Skip fields with no value to keep the display clean
            if (value === undefined || value === null || value === "") return null;

            return (
              <Table.Row key={key}>
                <Table.Cell className="font-bold w-1/3">{labels[key] || key}</Table.Cell>
                <Table.Cell>
                  <DynamicFieldDisplay schema={shape[key] as unknown as z.ZodTypeAny} value={value} />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </tbody>
      </Table.Component>
    );
  }

  return <p className="text-red-500">Unsupported spec display type.</p>;
}
