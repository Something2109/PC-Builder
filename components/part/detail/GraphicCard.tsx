import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import GraphicCard from "@/utils/interface/part/info/GraphicCard";
import { LengthUnits, FrequencyUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<GraphicCard.Info> = {
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
    Object.entries(value ?? {})
      .map(([key, count]) => `${count} * ${key}`)
      .join(", "),
  port: ({ value }) =>
    Object.entries(value ?? {})
      .map(([key, count]) => `${count} * ${key}`)
      .join(", "),
  gpu: ({ value }) => <></>,
};

export default InfoComponent(Components, GraphicCard.Label, { strict: true });
