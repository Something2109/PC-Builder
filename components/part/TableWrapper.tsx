import {
  FunctionComponent,
  HTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
} from "react";
import { ChoiceInput, Input, Select } from "../utils/Input";
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
  }
) {
  return ({ defaultValue }: { defaultValue?: Partial<T> }) => (
    <>
      {Object.entries(Components).map(([key, Component], index) => {
        const value = defaultValue ? defaultValue[key] : undefined;

        return (
          <td key={new Date().getTime() + index}>
            <RowWrapper>
              <p className="lg:hidden">{Labels[key]}:</p>
            </RowWrapper>
            <Component value={value} />
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

export function DimensionTableRow({
  defaultValue,
}: {
  defaultValue?: { width?: number; length?: number; height?: number };
}) {
  return (
    <>
      <Table.Row>
        <Table.Cell rowSpan={3}>Dimension</Table.Cell>
        <Table.Cell className="font-bold">Width</Table.Cell>
        <Table.Cell>{defaultValue?.width}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Length</Table.Cell>
        <Table.Cell>{defaultValue?.length}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Height</Table.Cell>
        <Table.Cell>{defaultValue?.height}</Table.Cell>
      </Table.Row>
    </>
  );
}

export function InputRow({
  name,
  label,
  options,
  ...rest
}: {
  label: string;
  options?: string[];
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <TableRowWrapper>
      <label htmlFor={name}>{label}</label>
      <Input
        name={name}
        id={name}
        placeholder={label}
        list={options ? `${name}s` : undefined}
        {...rest}
      />
    </TableRowWrapper>
  );
}

export function SelectInputRow({
  name,
  label,
  options,
  ...rest
}: {
  name: string;
  label: string;
  options: any[];
} & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <TableRowWrapper>
      <label htmlFor={name}>{label}</label>
      <Select name={name} id={name} {...rest}>
        {Object.values(options).map((product) => (
          <option key={`${name}-${product}`} value={product}>
            {product}
          </option>
        ))}
      </Select>
    </TableRowWrapper>
  );
}

export function ChoiceInputRow({
  type,
  name,
  label,
  options,
  defaultValue,
  ...rest
}: {
  type: "checkbox" | "radio";
  name?: string;
  label?: string;
  options: string[];
  defaultValue?: string[];
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <TableRowWrapper>
      <label htmlFor={name}>{label}</label>
      <div {...rest}>
        {options.map((val) => (
          <ChoiceInput
            type={type}
            name={name}
            value={val}
            defaultChecked={defaultValue?.includes(val) ?? false}
          />
        ))}
      </div>
    </TableRowWrapper>
  );
}

export function DimensionInputRow({
  defaultValue,
}: {
  defaultValue?: { width?: number; length?: number; height?: number };
}) {
  return (
    <>
      <Table.Row>
        <Table.Cell rowSpan={3}>Dimension</Table.Cell>
        <Table.Cell className="font-bold">
          <label htmlFor="width">Width</label>
        </Table.Cell>
        <Table.Cell>
          <Input
            type="number"
            step="0.01"
            name="width"
            id="width"
            placeholder="Width"
            defaultValue={defaultValue?.width}
          />
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <label htmlFor="length">Length</label>
        </Table.Cell>
        <Table.Cell>
          <Input
            type="number"
            step="0.01"
            name="length"
            id="length"
            placeholder="Length"
            defaultValue={defaultValue?.length}
          />
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <label htmlFor="height">Height</label>
        </Table.Cell>
        <Table.Cell>
          <Input
            type="number"
            step="0.01"
            name="height"
            id="height"
            placeholder="Height"
            defaultValue={defaultValue?.height}
          />
        </Table.Cell>
      </Table.Row>
    </>
  );
}
