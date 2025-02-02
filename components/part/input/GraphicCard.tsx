import { GenericInputTable } from "../TableWrapper";
import { Input } from "@/components/utils/Input";
import GraphicCard from "@/utils/interface/part/GraphicCard";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof GraphicCard.Info]: FunctionComponent<{
    value?: GraphicCard.Info[key];
  }>;
} = {
  width: ({ value }) => (
    <Input type="number" step="0.01" name="width" defaultValue={value} />
  ),
  length: ({ value }) => (
    <Input type="number" step="0.01" name="length" defaultValue={value} />
  ),
  height: ({ value }) => (
    <Input type="number" step="0.01" name="height" defaultValue={value} />
  ),
  base_frequency: ({ value }) => (
    <Input type="number" name="base_frequency" defaultValue={value} />
  ),
  boost_frequency: ({ value }) => (
    <Input type="number" name="boost_frequency" defaultValue={value} />
  ),
  pcie: ({ value }) => <Input type="number" name="pcie" defaultValue={value} />,
  minimum_psu: ({ value }) => (
    <Input type="number" name="minimum_psu" defaultValue={value} />
  ),
  power_connector: ({ value }) => <></>,
  port: ({ value }) => <></>,
  gpu: ({ value }) => <></>,
};

export default GenericInputTable(Components, GraphicCard.Label);
