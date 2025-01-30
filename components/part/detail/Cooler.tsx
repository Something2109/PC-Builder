import {
  DimensionTableRow,
  TableRowWrapper,
  TableWrapper,
} from "../TableWrapper";
import Cooler from "@/utils/interface/part/Cooler";
import { FunctionComponent, TableHTMLAttributes } from "react";

const Components: {
  [key in keyof Cooler.Info]: FunctionComponent<{ value: Cooler.Info[key] }>;
} = {
  socket: ({ value }) => <TableRowWrapper>Socket {value}</TableRowWrapper>,
  cpu_plate: ({ value }) => (
    <TableRowWrapper>CPU Plate {value}</TableRowWrapper>
  ),
  width: ({ value }) => <TableRowWrapper>Width {value}</TableRowWrapper>,
  length: ({ value }) => <TableRowWrapper>Length {value}</TableRowWrapper>,
  height: ({ value }) => <TableRowWrapper>Height {value}</TableRowWrapper>,
};

export function CoolerTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<Cooler.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      {Object.entries(defaultValue ?? {}).map(([key, value]) => {
        const Component = Components[key as keyof Cooler.Info];

        if (!value || !Component) return undefined;

        return Component(value as never);
      })}
    </TableWrapper>
  );
}
