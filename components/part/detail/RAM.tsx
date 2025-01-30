import RAM from "@/utils/interface/part/RAM";
import { FunctionComponent, TableHTMLAttributes } from "react";
import { TableRowWrapper, TableWrapper } from "../TableWrapper";

const Components: {
  [key in keyof RAM.Info]: FunctionComponent<{ value: RAM.Info[key] }>;
} = {
  speed: ({ value }) => <TableRowWrapper>Speed {value}</TableRowWrapper>,
  capacity: ({ value }) => <TableRowWrapper>Capacity {value}</TableRowWrapper>,
  voltage: ({ value }) => <TableRowWrapper>Voltage {value}</TableRowWrapper>,
  latency: ({ value }) => (
    <TableRowWrapper>
      Latency {value.map((val) => val.toString()).join(" - ")}
    </TableRowWrapper>
  ),
  kit: ({ value }) => <TableRowWrapper>RAM Kit {value}</TableRowWrapper>,
  form_factor: ({ value }) => (
    <TableRowWrapper>Form Factor {value}</TableRowWrapper>
  ),
  interface: ({ value }) => (
    <TableRowWrapper>Interface {value}</TableRowWrapper>
  ),
};

export function RAMTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<RAM.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      {Object.entries(defaultValue ?? {}).map(([key, value]) => {
        const Component = Components[key as keyof RAM.Info];

        if (!value || !Component) return undefined;

        return Component(value as never);
      })}
    </TableWrapper>
  );
}
