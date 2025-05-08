"use client";

import { Button } from "@/components/utils/Button";
import { RowWrapper } from "@/components/utils/FlexWrapper";
import Part, { Information } from "@/utils/interface/part";
import { Infos } from "@/utils/Enum";
import {
  FunctionComponent,
  TableHTMLAttributes,
  useRef,
  useActionState,
  useState,
} from "react";

export function useInfoAction(
  path: string,
  info: Infos,
  defaultValue: Part.Detail
) {
  const label = useRef(Information.Label[info]);
  const [error, setError] = useState<string | null>(null);
  const [formValue, save, pending] = useActionState<
    Partial<Part.Detail[typeof info]> | null,
    Partial<Part.Detail[typeof info]> | null
  >(async (prev, data) => {
    const operation = prev ? (data ? "save" : "delete") : "add";

    setError(null);
    if (
      !confirm(`Are you sure you want to ${operation} ${label.current} info?`)
    )
      return prev;

    const body = JSON.stringify({ [info]: data });

    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (!response.ok) {
      setError((await response.json()).message);
      return prev;
    } else {
      alert(`Successfully ${operation} ${label.current} info.`);
    }

    const newData = (await response.json()) as Part.Detail;

    return newData[info];
  }, defaultValue[info]);

  return [formValue, save, pending, error, setError] as const;
}

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
