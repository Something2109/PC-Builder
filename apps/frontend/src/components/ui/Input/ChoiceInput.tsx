"use client";

import { RowWrapper } from "../Layout/FlexWrapper";
import { mergeClass } from "../mergeClass";
import { InputProps } from "./Input";

export function ChoiceInput({
  name,
  value,
  type,
  ...rest
}: {
  type: "checkbox" | "radio";
} & Omit<InputProps, "type">) {
  const id = `choice-${type}-${name}-${value}`;

  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-border/80 dark:border-border bg-card/15 dark:bg-card/5 hover:bg-accent-indigo/5 hover:border-accent-indigo/40 transition-all cursor-pointer select-none text-sm text-text/85 font-medium"
    >
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        className={
          type === "checkbox"
            ? "rounded border-border/80 dark:border-border bg-transparent text-accent-indigo focus:ring-accent-indigo focus:ring-offset-background w-4 h-4 cursor-pointer"
            : "rounded-full border-border/80 dark:border-border bg-transparent text-accent-indigo focus:ring-accent-indigo focus:ring-offset-background w-4 h-4 cursor-pointer"
        }
        {...rest}
      />
      <span>{value}</span>
    </label>
  );
}

export function MultipleChoiceInput({
  className,
  value,
  defaultValue,
  ...props
}: {
  value: string[];
  defaultValue?: string[];
} & Omit<InputProps, "defaultValue" | "value">) {
  return (
    <RowWrapper className={mergeClass("flex-wrap gap-2", className)}>
      {value.map((val) => (
        <ChoiceInput
          {...props}
          type="checkbox"
          key={val}
          value={val}
          defaultChecked={defaultValue?.includes(val)}
        />
      ))}
    </RowWrapper>
  );
}
