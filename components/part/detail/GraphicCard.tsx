import { TableRowWrapper } from "../TableWrapper";
import GraphicCard from "@/utils/interface/part/GraphicCard";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof GraphicCard.Info]: FunctionComponent<{
    value: GraphicCard.Info[key];
  }>;
} = {
  width: ({ value }) => <TableRowWrapper>Width {value}</TableRowWrapper>,
  length: ({ value }) => <TableRowWrapper>Length {value}</TableRowWrapper>,
  height: ({ value }) => <TableRowWrapper>Height {value}</TableRowWrapper>,
  base_frequency: ({ value }) => (
    <TableRowWrapper>Base Frequency {value}</TableRowWrapper>
  ),
  boost_frequency: ({ value }) => (
    <TableRowWrapper>Boost Frequency {value}</TableRowWrapper>
  ),
  pcie: ({ value }) => <TableRowWrapper>PCIe Version {value}</TableRowWrapper>,
  minimum_psu: ({ value }) => (
    <TableRowWrapper>Minimum PSU Required {value}</TableRowWrapper>
  ),
  power_connector: ({ value }) => (
    <TableRowWrapper>
      Power Connector
      {Object.entries({ value })
        .map(([key, count]) => `${count} * ${key}`)
        .join(", ")}
    </TableRowWrapper>
  ),
  port: ({ value }) => (
    <TableRowWrapper>
      Display Connector
      {Object.entries({ value })
        .map(([key, count]) => `${count} * ${key}`)
        .join(", ")}
    </TableRowWrapper>
  ),
  gpu: function ({ value }): JSX.Element {
    throw new Error("Function not implemented.");
  },
};

export { Components as GraphicCardComponents };
