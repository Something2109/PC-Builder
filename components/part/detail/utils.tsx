import React, { HTMLAttributes, TableHTMLAttributes } from "react";

const tableClass = "w-full";
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

export function DimensionTableRowWrapper({
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
