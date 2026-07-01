"use client";

import { DetailedHTMLProps, SelectHTMLAttributes } from "react";
import { mergeClass } from "../mergeClass";
import { defaultStyle, cleanEvent } from "./base";

export type SelectProps = DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;

export function Select({ className, onChange, ...rest }: SelectProps) {
  return (
    <select
      className={mergeClass(
        `${defaultStyle} pr-10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-position-[right_0.75rem_center] bg-size-[1.25rem_1.25rem] bg-no-repeat`,
        className
      )}
      onChange={(e) => cleanEvent(e, onChange)}
      {...rest}
    />
  );
}

export function OptionSelect({ options, ...rest }: { options: string[] | number[] } & SelectProps) {
  return (
    <Select {...rest}>
      {!rest.required && (
        <option className="bg-card text-text" value={""}>
          None
        </option>
      )}
      {options.map((value) => (
        <option className="bg-card text-text" key={`options-${rest.name}-${value}`} value={value}>
          {value}
        </option>
      ))}
    </Select>
  );
}
