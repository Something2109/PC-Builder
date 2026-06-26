import React, { startTransition } from "react";
import { z } from "zod";
import { useForm, DeepKeys, StandardSchemaV1 } from "@tanstack/react-form";

import { FormApi } from "@/type/form";
import { Button } from "@/ui/Button";
import { RowWrapper } from "@/ui/FlexWrapper";

import { DynamicField } from "./DynamicField";
import { Table } from "./Table";

interface DynamicObjectFormProps<T extends Record<string, unknown> = Record<string, unknown>> {
  schema: z.ZodObject<z.ZodRawShape>;
  labels: Record<string, string>;
  pending: boolean;
  defaultValue: T;
  onSubmit: (value: T) => void;
}

/**
 * Renders form fields for a ZodObject shape in a vertical table
 */
function ObjectFormFields<T extends Record<string, unknown>>({
  form,
  schema,
  labels,
}: {
  form: FormApi<T>;
  schema: z.ZodObject<z.ZodRawShape>;
  labels: Record<string, string>;
}) {
  const shape = schema.shape;
  const properties = Object.keys(shape);

  return (
    <Table.Component>
      <tbody>
        {properties.map((key) => {
          const fieldLabel = labels[key] || key;
          return (
            <Table.Row key={key}>
              <Table.Cell className="font-bold w-1/3">{fieldLabel}</Table.Cell>
              <Table.Cell>
                <form.Field name={key as DeepKeys<T>}>
                  {(field) => <DynamicField field={field} schema={shape[key] as unknown as z.ZodTypeAny} label={fieldLabel} />}
                </form.Field>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </tbody>
    </Table.Component>
  );
}

export function DynamicObjectForm<T extends Record<string, unknown> = Record<string, unknown>>({
  schema,
  labels,
  pending,
  defaultValue,
  onSubmit,
}: DynamicObjectFormProps<T>) {
  const form = useForm({
    defaultValues: defaultValue,
    onSubmit: ({ value }) => startTransition(() => onSubmit(value as T)),
    validators: { onChange: schema as unknown as StandardSchemaV1<T, unknown> },
  }) as unknown as FormApi<T>;

  return (
    <form
      action={() => {
        form.handleSubmit();
      }}
      className="flex flex-col gap-1 w-full"
    >
      <ObjectFormFields form={form} schema={schema} labels={labels} />
      {pending ? (
        <p className="button border-0">Saving...</p>
      ) : (
        <RowWrapper>
          <Button type="button" onClick={() => form.handleSubmit()}>
            Delete
          </Button>
          <Button type="submit" className="w-full" disabled={pending}>
            Save
          </Button>
        </RowWrapper>
      )}
    </form>
  );
}
