import { GenericDetailTable } from "../TableWrapper";
import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import GraphicCard from "@/utils/interface/info/GraphicCard";
import { LengthUnits, FrequencyUnits } from "@/utils/extract/Units";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof GraphicCard.Info]: FunctionComponent<{
    value: GraphicCard.Info[key];
  }>;
} = {
  width: ({ value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  length: ({ value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  height: ({ value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  base_frequency: ({ value }) => (
    <UnitDisplay Unit={FrequencyUnits} defaultUnit="MHz" defaultValue={value} />
  ),
  boost_frequency: ({ value }) => (
    <UnitDisplay Unit={FrequencyUnits} defaultUnit="MHz" defaultValue={value} />
  ),
  pcie: ({ value }) => value,
  minimum_psu: ({ value }) => <SuffixDisplay suffix="W">{value}</SuffixDisplay>,
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
