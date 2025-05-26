import {
  FunctionComponent,
  InputHTMLAttributes,
  SelectHTMLAttributes,
} from "react";
import { RowWrapper } from "../utils/FlexWrapper";
import { VerticalCollapsible } from "../utils/Collapsible";
import { Toggler } from "../utils/Toggle";
import { InfoLabel } from "./utils/Table";

export type InfoSummaryMapping<T extends Record<string, any>> = {
  [key in keyof Required<T>]: FunctionComponent<{ value?: T[key] }>;
};

export function GenericSummaryCells<T extends Record<string, any>>(
  Components: InfoSummaryMapping<T>,
  Labels: InfoLabel<T>,
  Attributes: string[]
) {
  return ({ defaultValue }: { defaultValue?: Partial<T> }) => (
    <>
      {Attributes.map((attr, index) => {
        const Component = Components[attr] as FunctionComponent<{
          value?: T[typeof attr];
        }>;
        const value = defaultValue ? defaultValue[attr] : undefined;

        return (
          <td key={new Date().getTime() + index}>
            <RowWrapper>
              <p className="lg:hidden">{Labels[attr]}:</p>
              {Component ? <Component value={value} /> : undefined}
            </RowWrapper>
          </td>
        );
      })}
    </>
  );
}

type CustomFilterComponent<Value> = FunctionComponent<
  { value: NonNullable<Value>; defaultValue?: Value } & Omit<
    InputHTMLAttributes<HTMLInputElement> &
      SelectHTMLAttributes<HTMLSelectElement>,
    "defaultValue" | "value"
  >
>;

export type FilterMapping<T extends Record<string, any>> = {
  [key in keyof Required<T>]: CustomFilterComponent<T[key]>;
};

export function GenericFilterBar<T extends Record<string, string[] | number[]>>(
  Components: FilterMapping<T>,
  Labels: InfoLabel<T>
) {
  return ({
    defaultValue,
    value,
  }: {
    defaultValue: URLSearchParams;
    value?: Partial<T>;
  }) => (
    <>
      {Object.entries(Components).map(([key, Component]) => {
        if (!value || !value[key]) return;

        return (
          <Toggler
            className="w-full"
            key={`Filter-${key}`}
            label={`Add ${Labels[key]} Filter`}
            defaultToggle={defaultValue.getAll(key).length > 0}
          >
            <VerticalCollapsible className="w-full">
              <label htmlFor={key}>{Labels[key]}</label>
              <Component
                id={`Filter-${key}`}
                name={key}
                title={Labels[key]}
                placeholder={Labels[key]}
                value={value[key]}
                defaultValue={defaultValue.getAll(key)}
              />
            </VerticalCollapsible>
          </Toggler>
        );
      })}
    </>
  );
}
