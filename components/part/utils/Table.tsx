import {
  FunctionComponent,
  HTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
} from "react";

export namespace Table {
  const tableClass = "w-full border-2";
  const tableHead = "font-bold";
  const tableRow =
    "border-b-2 only:last:border-b-2 last:border-b-0 *:rounded-sm";
  const tableCell = "border-r-2 last:border-r-0 p-2 [&:has(table)]:p-0";

  export const Component = ({
    className,
    ...rest
  }: HTMLAttributes<HTMLTableElement>) => (
    <table
      className={className ? className.concat(" ", tableClass) : tableClass}
      {...rest}
    />
  );

  export const Head = ({
    className,
    ...attr
  }: HTMLAttributes<HTMLTableSectionElement>) => (
    <thead
      className={className ? className.concat(" ", tableHead) : tableHead}
      {...attr}
    />
  );

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

type InfoAttributeComponent<Value> = FunctionComponent<
  { value?: NonNullable<Value>; defaultValue?: Exclude<Value, null> } & Omit<
    InputHTMLAttributes<HTMLInputElement> &
      SelectHTMLAttributes<HTMLSelectElement>,
    "defaultValue" | "value"
  >
>;

export type InfoComponentObject<T extends Record<string, any>> = {
  [key in keyof Required<T>]: InfoAttributeComponent<T[key]>;
};

export type InfoLabel<T extends Record<string, any>> = {
  [key in keyof Required<T>]: string;
};

export function InfoComponent<T extends Record<string, any>>(
  ComponentObject: InfoComponentObject<T>,
  Labels: InfoLabel<T>,
  { strict }: { strict?: boolean } = {}
) {
  return ({
    defaultValue,
    className,
    ...rest
  }: {
    defaultValue?: Partial<T> | null;
  } & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) => (
    <Table.Component>
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
}
