import { GenericDetailTable } from "../TableWrapper";
import GraphicCard from "@/utils/interface/info/GraphicCard";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof GraphicCard.Info]: FunctionComponent<{
    value: GraphicCard.Info[key];
  }>;
} = {
  width: ({ value }) => value,
  length: ({ value }) => value,
  height: ({ value }) => value,
  base_frequency: ({ value }) => value,
  boost_frequency: ({ value }) => value,
  pcie: ({ value }) => value,
  minimum_psu: ({ value }) => value,
  power_connector: ({ value }) =>
    Object.entries(value)
      .map(([key, count]) => `${count} * ${key}`)
      .join(", "),
  port: ({ value }) =>
    Object.entries(value)
      .map(([key, count]) => `${count} * ${key}`)
      .join(", "),
  gpu: ({ value }) => <></>,
};

export default GenericDetailTable(Components, GraphicCard.Label);
