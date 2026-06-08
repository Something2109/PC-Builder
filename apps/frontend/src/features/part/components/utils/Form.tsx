"use client";

import { useForm } from "@tanstack/react-form";
import { FunctionComponent, TableHTMLAttributes } from "react";

import { FormApi, FormOptions } from "@/type/form";
import { Button } from "@/ui/Button";
import { RowWrapper } from "@/ui/FlexWrapper";

type InputFieldProps<T extends object> = Readonly<{
  pending: boolean;
}> &
  Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue"> &
  Pick<FormOptions<T>, "defaultValues" | "onSubmit">;

type InputFieldComponent<T extends object> = FunctionComponent<{
  form: FormApi<T>;
  defaultValue?: T | null;
}>;

export function GenericInputField<T extends object>(
  InputComponent: InputFieldComponent<T>,
  _transform?: (data: FormData) => T
) {
  const InputField = ({
    pending,
    defaultValues,
    onSubmit,
    ...props
  }: InputFieldProps<T>) => {
    const form = useForm({ defaultValues, onSubmit });

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-1 w-full"
      >
        <InputComponent form={form} defaultValue={defaultValues} {...props} />
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
  };

  return InputField;
}

export function defaultParse(data: FormData) {
  return Object.fromEntries(
    data
      .entries()
      .map(([key, value]) => [
        key,
        value === "" || Number(value) === 0 ? undefined : value,
      ])
      .filter(([, value]) => value)
  ) as Record<string, string | string[]>;
}
