import Radiator from "@/utils/interface/part/Radiator";
import {
  TableRowWrapper,
  TableWrapper,
  DimensionTableRow,
} from "../TableWrapper";
import { FunctionComponent, TableHTMLAttributes } from "react";

const Components: {
  [key in keyof Radiator.Info]: FunctionComponent<{
    value: Radiator.Info[key];
  }>;
} = {
  form_factor: ({ value }) => (
    <TableRowWrapper>Form Factor {value}</TableRowWrapper>
  ),
  width: ({ value }) => <TableRowWrapper>Width {value}</TableRowWrapper>,
  length: ({ value }) => <TableRowWrapper>Length {value}</TableRowWrapper>,
  height: ({ value }) => <TableRowWrapper>Height {value}</TableRowWrapper>,
  fpi: ({ value }) => <TableRowWrapper>FPI {value}</TableRowWrapper>,
  material: ({ value }) => <TableRowWrapper>Material {value}</TableRowWrapper>,
};

export function RadiatorTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<Radiator.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      {Object.entries(defaultValue ?? {}).map(([key, value]) => {
        const Component = Components[key as keyof Radiator.Info];

        if (!value || !Component) return undefined;

        return Component(value as never);
      })}
    </TableWrapper>
  );
}
