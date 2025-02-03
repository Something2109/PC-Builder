import {
  FunctionComponent,
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
} from "react";
import { RowWrapper } from "../utils/FlexWrapper";

export namespace Table {
  const tableRow = "border-b-2 last:border-b-0 *:rounded-sm";
  const tableCell =
    "border-r-2 last:border-r-0 first:font-bold p-2 [&:has(table)]:p-0";

  export const Row = ({
    className,
    ...attr
  }: HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={className ? className.concat(" ", tableRow) : tableRow}
      {...attr}
    />
  );

  export const Cell = ({
    className,
    ...attr
  }: TdHTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={className ? className.concat(" ", tableCell) : tableCell}
      {...attr}
    />
  );
}

export function GenericSummaryCells<T extends Record<string, any>>(
  Components: {
    [key in keyof T]: FunctionComponent<{ value: T[key] | undefined }>;
  },
  Labels: {
    [key in string]: string;
  },
  Attributes: string[]
) {
  return ({ defaultValue }: { defaultValue?: Partial<T> }) => (
    <>
      {Attributes.map((attr, index) => {
        const Component = Components[attr];
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

const tableClass = "w-full border-2";

export function GenericTable<T extends Record<string, any>>(
  Components: { [key in keyof T]: FunctionComponent<{ value: T[key] }> },
  Labels: { [key in string]: string }
) {
  return ({
    defaultValue,
    ...rest
  }: {
    defaultValue?: Partial<T>;
  } & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) => (
    <TableWrapper {...rest}>
      {Object.entries(Components).map(([key, Component]) => {
        const value = defaultValue ? defaultValue[key] : undefined;

        if (!value) return undefined;

        return (
          <TableRowWrapper key={key}>
            {Labels[key]}
            <Component value={value} />
          </TableRowWrapper>
        );
      })}
    </TableWrapper>
  );
}

export function GenericInputTable<T extends Record<string, any>>(
  Components: {
    [key in keyof T]: FunctionComponent<{ value?: T[key]; id?: string }>;
  },
  Labels: { [key in string]: string }
) {
  return ({
    defaultValue,
    ...rest
  }: {
    defaultValue?: Partial<T>;
  } & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) => (
    <TableWrapper {...rest}>
      {Object.entries(Components).map(([key, Component]) => {
        const value = defaultValue ? defaultValue[key] : undefined;

        return (
          <TableRowWrapper key={key}>
            {Labels[key]}
            <Component value={value} />
          </TableRowWrapper>
        );
      })}
    </TableWrapper>
  );
}

export function TableWrapper({
  className,
  children,
  ...rest
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={className ? className.concat(" ", tableClass) : tableClass}
      {...rest}
    >
      <tbody>{children}</tbody>
    </table>
  );
}

export function TableRowWrapper({
  children,
  ...rest
}: { children: React.ReactNode[] } & HTMLAttributes<HTMLTableRowElement>) {
  return (
    <Table.Row {...rest}>
      {[...children].map((child, index) => (
        <Table.Cell
          colSpan={index === 0 ? 2 : 1}
          key={new Date().getTime() + index}
        >
          {child}
        </Table.Cell>
      ))}
    </Table.Row>
  );
}
