import React from "react";
import { z } from "zod";
import { DeepKeys } from "@tanstack/react-form";

import { FieldApi } from "@/type/form";
import { ChoiceInput, Input, OptionSelect, SuffixInput, UnitInput } from "@/ui/Input";

import { inspectFieldSchema } from "./schemaInspector";
import { mapChange } from "./TanstackForm";

interface DynamicFieldProps<
  TParentData extends object,
  TName extends DeepKeys<TParentData>,
> {
  field: FieldApi<TParentData, TName>;
  schema: z.ZodTypeAny;
  label: string;
}

export function DynamicField<
  TParentData extends object,
  TName extends DeepKeys<TParentData>,
>({ field, schema, label }: DynamicFieldProps<TParentData, TName>) {
  const fieldConfig = inspectFieldSchema(schema);

  switch (fieldConfig.type) {
    case "number":
      if (fieldConfig.unitConfig) {
        return (
          <UnitInput
            Unit={fieldConfig.unitConfig.unit}
            defaultUnit={fieldConfig.unitConfig.target}
            placeholder={label}
            defaultValue={field.state.value as number}
            name={field.name as string}
            onChange={(e) => field.handleChange(Number(e.target.value) as Parameters<typeof field.handleChange>[0])}
          />
        );
      }

      if (fieldConfig.suffixConfig) {
        return (
          <SuffixInput
            suffix={fieldConfig.suffixConfig.suffix}
            type="number"
            placeholder={label}
            defaultValue={field.state.value as number}
            name={field.name as string}
            onChange={(e) => field.handleChange(Number(e.target.value) as Parameters<typeof field.handleChange>[0])}
          />
        );
      }

      return (
        <Input
          type="number"
          placeholder={label}
          name={field.name as string}
          defaultValue={field.state.value as number}
          onChange={(e) => field.handleChange(Number(e.target.value) as Parameters<typeof field.handleChange>[0])}
        />
      );

    case "enum": {
      const selectProps = mapChange(field, "select") as {
        value: string;
        onChange: (e: { target: { value: string } }) => void;
      };
      return (
        <OptionSelect
          options={fieldConfig.options || []}
          required={fieldConfig.isRequired}
          name={field.name as string}
          {...selectProps}
        />
      );
    }

    case "boolean":
      return (
        <ChoiceInput
          type="checkbox"
          name={field.name as string}
          checked={!!field.state.value}
          onChange={(e) => field.handleChange(e.target.checked as Parameters<typeof field.handleChange>[0])}
        />
      );

    case "string":
    default: {
      const stringProps = mapChange(field, "string") as {
        defaultValue: string | undefined;
        onChange: (e: { target: { value: string } }) => void;
      };
      return (
        <Input
          type="text"
          placeholder={label}
          name={field.name as string}
          {...stringProps}
        />
      );
    }
  }
}
