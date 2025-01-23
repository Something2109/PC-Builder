import {
  HTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TableHTMLAttributes,
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
        <td
          colSpan={index === 0 ? 2 : 1}
          key={new Date().getTime() + index}
          className={`${tableCell} `}
        >
          {child}
        </td>
      ))}
    </tr>
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
        <td className={tableCell} rowSpan={3}>
          Dimension
        </td>
        <td className={`${tableCell} font-bold`}>Width</td>
        <td className={tableCell}>{defaultValue?.width}</td>
      </tr>
      <tr className={tableRow}>
        <td className={tableCell}>Length</td>
        <td className={tableCell}>{defaultValue?.length}</td>
      </tr>
      <tr className={tableRow}>
        <td className={tableCell}>Height</td>
        <td className={tableCell}>{defaultValue?.height}</td>
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
        <td className={tableCell} rowSpan={3}>
          Dimension
        </td>
        <td className={`${tableCell} font-bold`}>
          <label htmlFor="width">Width</label>
        </td>
        <td className={tableCell}>
          <Input
            type="number"
            step="0.01"
            name="width"
            id="width"
            placeholder="Width"
            defaultValue={defaultValue?.width}
          />
        </td>
      </tr>
      <tr className={tableRow}>
        <td className={tableCell}>
          <label htmlFor="length">Length</label>
        </td>
        <td className={tableCell}>
          <Input
            type="number"
            step="0.01"
            name="length"
            id="length"
            placeholder="Length"
            defaultValue={defaultValue?.length}
          />
        </td>
      </tr>
      <tr className={tableRow}>
        <td className={tableCell}>
          <label htmlFor="height">Height</label>
        </td>
        <td className={tableCell}>
          <Input
            type="number"
            step="0.01"
            name="height"
            id="height"
            placeholder="Height"
            defaultValue={defaultValue?.height}
          />
        </td>
      </tr>
    </>
  );
}
