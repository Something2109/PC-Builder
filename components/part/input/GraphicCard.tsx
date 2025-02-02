import { InputRow, GenericTable } from "../TableWrapper";
import GraphicCard from "@/utils/interface/part/GraphicCard";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof GraphicCard.Info]: FunctionComponent<{
    value: GraphicCard.Info[key];
  }>;
} = {
  width: ({ value }) => (
    <InputRow
      type="number"
      step="0.01"
      name="width"
      label="Width"
      defaultValue={value}
    />
  ),
  length: ({ value }) => (
    <InputRow
      type="number"
      step="0.01"
      name="length"
      label="Length"
      defaultValue={value}
    />
  ),
  height: ({ value }) => (
    <InputRow
      type="number"
      step="0.01"
      name="height"
      label="Height"
      defaultValue={value}
    />
  ),
  base_frequency: ({ value }) => (
    <InputRow
      type="number"
      name="base_frequency"
      label="Base Frequency"
      defaultValue={value}
    />
  ),
  boost_frequency: ({ value }) => (
    <InputRow
      type="number"
      name="boost_frequency"
      label="Boost Frequency"
      defaultValue={value}
    />
  ),
  pcie: ({ value }) => (
    <InputRow
      type="number"
      name="pcie"
      label="PCIe Version"
      defaultValue={value}
    />
  ),
  minimum_psu: ({ value }) => (
    <InputRow
      type="number"
      name="minimum_psu"
      label="Minimum PSU Required"
      defaultValue={value}
    />
  ),
  power_connector: ({ value }) => <></>,
  port: ({ value }) => <></>,
  gpu: ({ value }) => <></>,
};

export default GenericTable(Components);
