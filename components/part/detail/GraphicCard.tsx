import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import GraphicCard from "@/utils/interface/part/info/GraphicCard";
import { LengthUnits, FrequencyUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<GraphicCard.Info> = {
  width: ({ defaultValue: value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  length: ({ defaultValue: value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  height: ({ defaultValue: value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  base_frequency: ({ defaultValue: value }) => (
    <UnitDisplay Unit={FrequencyUnits} defaultUnit="MHz" defaultValue={value} />
  ),
  boost_frequency: ({ defaultValue: value }) => (
    <UnitDisplay Unit={FrequencyUnits} defaultUnit="MHz" defaultValue={value} />
  ),
  pcie: ({ defaultValue: value }) => value,
  minimum_psu: ({ defaultValue: value }) => (
    <SuffixDisplay suffix="W">{value}</SuffixDisplay>
  ),
  power_connector: ({ defaultValue: value }) =>
    Object.entries(value ?? {})
      .map(([key, count]) => `${count} * ${key}`)
      .join(", "),
  port: ({ defaultValue: value }) =>
    Object.entries(value ?? {})
      .map(([key, count]) => `${count} * ${key}`)
      .join(", "),
  gpu: ({ defaultValue: value }) => <></>,
};

export default InfoComponent(Components, GraphicCard.Label, { strict: true });
