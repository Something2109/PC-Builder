"use client";

import { Button } from "@/components/utils/Button";
import { RowWrapper } from "@/components/utils/FlexWrapper";
import { FunctionComponent, TableHTMLAttributes } from "react";

export function GenericInputField<T>(
  InputComponent: FunctionComponent<{ defaultValue?: T | null }>,
  transform: (data: FormData) => T
) {
  return ({
    pending,
    onSubmit,
    ...props
  }: {
    pending: boolean;
    onSubmit: (data: T | null) => void;
    defaultValue?: T;
  } & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) => {
    return (
      <>
        <InputComponent {...props} />
        {pending ? (
          <p className="button border-0">Saving...</p>
        ) : (
          <RowWrapper>
            <Button type="submit" formAction={() => onSubmit(null)}>
              Delete
            </Button>
            <Button
              type="submit"
              formAction={(formData: FormData) => onSubmit(transform(formData))}
              className="w-full"
              disabled={pending}
            >
              Save
            </Button>
          </RowWrapper>
        )}
      </>
    );
  };
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
