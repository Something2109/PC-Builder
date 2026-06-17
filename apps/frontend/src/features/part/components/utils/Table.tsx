import {
  FunctionComponent,
  HTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
} from "react";

import { mergeClass } from "@/ui/mergeClass";

export const Table = {
  Component: ({ className, children, ...rest }: HTMLAttributes<HTMLTableElement>) => (
    <div className="w-full border border-border/60 rounded-xl overflow-hidden bg-card shadow-xs">
      <table className={mergeClass("w-full border-collapse", className)} {...rest}>
        {children}
      </table>
    </div>
  ),

  Head: ({ className, ...attr }: HTMLAttributes<HTMLTableSectionElement>) => (
    <thead
      className={mergeClass(
        "bg-slate-50/50 dark:bg-slate-800/10 font-bold border-b border-border/60 text-text/80",
        className
      )}
      {...attr}
    />
  ),

  Row: ({ className, ...attr }: HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={mergeClass(
        "border-b border-border/40 last:border-b-0 hover:bg-slate-500/2 dark:hover:bg-slate-500/5 transition-colors",
        className
      )}
      {...attr}
    />
  ),

  Cell: ({ className, ...attr }: TdHTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={mergeClass(
        "border-r border-border/40 last:border-r-0 p-3 text-sm text-text/85 align-middle has-[table]:p-0",
        className
      )}
      {...attr}
    />
  ),
};

type InfoAttributeComponent<Value> = FunctionComponent<
  { value?: NonNullable<Value>; defaultValue?: Exclude<Value, null> } & Omit<
    InputHTMLAttributes<HTMLInputElement> & SelectHTMLAttributes<HTMLSelectElement>,
    "defaultValue" | "value"
  >
>;

export type InfoComponentObject<T extends Record<string, unknown>> = {
  [key in keyof Required<T>]: InfoAttributeComponent<T[key]>;
};

export type InfoLabel<T extends Record<string, unknown>> = {
  [key in keyof Required<T>]: string;
};

export function InfoComponent<T extends Record<string, unknown>>(
  ComponentObject: InfoComponentObject<T>,
  Labels: InfoLabel<T>,
  { strict }: { strict?: boolean } = {}
) {
  const InfoTable = ({
    defaultValue,
    ...rest
  }: {
    defaultValue?: Partial<T> | null;
  } & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) => (
    <Table.Component {...rest}>
      <tbody>
        {Object.entries(ComponentObject).map(([key, Component]) => {
          const value = defaultValue ? defaultValue[key] : undefined;

          if (!value && strict) return undefined;

          return (
            <Table.Row key={key}>
              <Table.Cell className="font-bold">{Labels[key]}</Table.Cell>
              <Table.Cell>
                <Component
                  name={key}
                  title={Labels[key]}
                  placeholder={Labels[key]}
                  defaultValue={value}
                />
              </Table.Cell>
            </Table.Row>
          );
        })}
      </tbody>
    </Table.Component>
  );

  return InfoTable;
}
