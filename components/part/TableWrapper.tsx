import {
  HTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
} from "react";
import { ChoiceInput, Input, Select } from "../utils/Input";

const tableClass = "w-full border-2";
const tableRow = "border-b-2 last:border-b-0 *:rounded-sm *:p-2";
const tableCell = "border-r-2 last:border-r-0 first:font-bold";

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
  className,
  children,
}: { children: React.ReactNode[] } & HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={className ? className.concat(" ", tableRow) : tableRow}>
      {[...children].map((child, index) => (
        <TableCellWrapper
          colSpan={index === 0 ? 2 : 1}
          key={new Date().getTime() + index}
        >
          {child}
        </TableCellWrapper>
      ))}
    </tr>
  );
}

export function TableCellWrapper({
  className,
  ...rest
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={className ? className.concat(" ", tableCell) : tableCell}
      {...rest}
    />
  );
}

export function DimensionTableRow({
  defaultValue,
}: {
  defaultValue?: { width?: number; length?: number; height?: number };
}) {
  return (
    <>
      <tr className={tableRow}>
        <TableCellWrapper rowSpan={3}>Dimension</TableCellWrapper>
        <TableCellWrapper className="font-bold">Width</TableCellWrapper>
        <TableCellWrapper>{defaultValue?.width}</TableCellWrapper>
      </tr>
      <tr className={tableRow}>
        <TableCellWrapper>Length</TableCellWrapper>
        <TableCellWrapper>{defaultValue?.length}</TableCellWrapper>
      </tr>
      <tr className={tableRow}>
        <TableCellWrapper>Height</TableCellWrapper>
        <TableCellWrapper>{defaultValue?.height}</TableCellWrapper>
      </tr>
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
      <tr className={tableRow}>
        <TableCellWrapper rowSpan={3}>Dimension</TableCellWrapper>
        <TableCellWrapper className="font-bold">
          <label htmlFor="width">Width</label>
        </TableCellWrapper>
        <TableCellWrapper>
          <Input
            type="number"
            step="0.01"
            name="width"
            id="width"
            placeholder="Width"
            defaultValue={defaultValue?.width}
          />
        </TableCellWrapper>
      </tr>
      <tr className={tableRow}>
        <TableCellWrapper>
          <label htmlFor="length">Length</label>
        </TableCellWrapper>
        <TableCellWrapper>
          <Input
            type="number"
            step="0.01"
            name="length"
            id="length"
            placeholder="Length"
            defaultValue={defaultValue?.length}
          />
        </TableCellWrapper>
      </tr>
      <tr className={tableRow}>
        <TableCellWrapper>
          <label htmlFor="height">Height</label>
        </TableCellWrapper>
        <TableCellWrapper>
          <Input
            type="number"
            step="0.01"
            name="height"
            id="height"
            placeholder="Height"
            defaultValue={defaultValue?.height}
          />
        </TableCellWrapper>
      </tr>
    </>
  );
}
