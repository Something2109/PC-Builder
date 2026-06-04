import { mergeClass } from "@/ui/mergeClass";
import { ReactFormExtendedApi } from "@tanstack/react-form";
import {
  FunctionComponent,
  HTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
} from "react";

export const Table = {
  Component: ({
    className,
    children,
    ...rest
  }: HTMLAttributes<HTMLTableElement>) => (
    <table className={mergeClass("w-full border-2", className)} {...rest}>
      {children}
    </table>
  ),

  Head: ({ className, ...attr }: HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className={mergeClass("font-bold", className)} {...attr} />
  ),

  Row: ({ className, ...attr }: HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={mergeClass(
        "border-b-2 only:last:border-b-2 last:border-b-0 *:rounded-sm",
        className
      )}
      {...attr}
    />
  ),

  Cell: ({ className, ...attr }: TdHTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={mergeClass(
        "border-r-2 not-only:last:border-r-0 p-2 [&:has(table)]:p-0",
        className
      )}
      {...attr}
    />
  ),
};

type InfoAttributeComponent<Value> = FunctionComponent<
  { value?: NonNullable<Value>; defaultValue?: Exclude<Value, null> } & Omit<
    InputHTMLAttributes<HTMLInputElement> &
      SelectHTMLAttributes<HTMLSelectElement>,
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
    form,
    defaultValue,
    ...rest
  }: {
    form?: ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any, any, any>;
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
                {form ? (
                  <form.Field name={key}>
                    {(field) => (
                      <Component
                        name={field.name}
                        value={field.state.value ?? ""}
                        onBlur={field.handleBlur}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => field.handleChange(e.target.value)}
                        title={Labels[key]}
                        placeholder={Labels[key]}
                      />
                    )}
                  </form.Field>
                ) : (
                  <Component
                    name={key}
                    title={Labels[key]}
                    placeholder={Labels[key]}
                    defaultValue={value}
                  />
                )}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </tbody>
    </Table.Component>
  );

  return InfoTable;
}
