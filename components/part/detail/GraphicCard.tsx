import {
  DimensionTableRowWrapper,
  TableRowWrapper,
  TableWrapper,
} from "./utils";
import GraphicCard from "@/utils/interface/part/GraphicCard";
import { TableHTMLAttributes } from "react";

export function GraphicCardTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<GraphicCard.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <DimensionTableRowWrapper defaultValue={defaultValue} />
      <TableRowWrapper>
        Base Frequency {defaultValue?.base_frequency}
      </TableRowWrapper>
      <TableRowWrapper>
        Boost Frequency {defaultValue?.boost_frequency}
      </TableRowWrapper>
      <TableRowWrapper>PCIe Version {defaultValue?.pcie}</TableRowWrapper>
      <TableRowWrapper>
        Minimum PSU Required {defaultValue?.minimum_psu}
      </TableRowWrapper>
      <TableRowWrapper>
        Power Connector {defaultValue?.power_connector}
      </TableRowWrapper>
    </TableWrapper>
  );
}
