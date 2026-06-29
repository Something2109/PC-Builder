import { ColumnDef } from "@tanstack/react-table";
import { FunctionComponent, HTMLAttributes } from "react";
import React from "react";

import { RowWrapper } from "@/ui/FlexWrapper";
import { mergeClass } from "@/ui/mergeClass";

import { InfoLabel } from "./Table";

export const SummaryTable = {
  Component: ({ className, children, ...rest }: HTMLAttributes<HTMLTableElement>) => (
    <table className={mergeClass("w-full border-separate border-spacing-0", className)} {...rest}>
      {children}
    </table>
  ),

  Head: ({ className, ...attr }: HTMLAttributes<HTMLTableSectionElement>) => (
    <thead
      className={mergeClass(
        "hidden z-100 lg:table-header-group font-bold sticky bg-white dark:bg-background transition-bg",
        className
      )}
      {...attr}
    />
  ),

  Row: ({ className, ...attr }: HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={mergeClass(
        "grid grid-cols-2 border-b-2 *:p-2 lg:table-row *:lg:border-b-2",
        className
      )}
      {...attr}
    />
  ),
};

export type InfoSummaryMapping<T extends Record<string, unknown>> = {
  [key in keyof Required<T>]: FunctionComponent<{ value?: T[key] }>;
};

export function GenericSummaryCells<T extends Record<string, unknown>>(
  Components: InfoSummaryMapping<T>,
  Labels: InfoLabel<T>,
  Attributes: string[],
  Classes?: Partial<Record<keyof T, string>>
): ColumnDef<T>[] {
  return Attributes.map<ColumnDef<T>>((attr) => {
    const label = Labels[attr];
    const className = Classes?.[attr] ?? "";
    const Component = Components[attr];

    return {
      id: attr,
      header: () => label,
      cell: ({ row }) => {
        const val = row.original[attr];
        if (!Component || val === undefined || val === null) return null;
        return (
          <RowWrapper>
            <p className="lg:hidden">{label}:</p>
            <Component value={val as T[string]} />
          </RowWrapper>
        );
      },
      meta: {
        className,
      },
    };
  });
}
