import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import Fan from "@/utils/interface/part/info/Fan";
import { LengthUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<Fan.Info> = {
  form_factor: ({ defaultValue: value }) => value,
  width: ({ defaultValue: value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  length: ({ defaultValue: value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  height: ({ defaultValue: value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  count: ({ defaultValue: value }) => value,
  voltage: ({ defaultValue: value }) => (
    <SuffixDisplay suffix="V">{value}</SuffixDisplay>
  ),
  speed: ({ defaultValue: value }) => (
    <SuffixDisplay suffix="RPM">{value}</SuffixDisplay>
  ),
  airflow: ({ defaultValue: value }) => (
    <SuffixDisplay suffix="CFM">{value}</SuffixDisplay>
  ),
  noise: ({ defaultValue: value }) => (
    <SuffixDisplay suffix="dBA">{value}</SuffixDisplay>
  ),
  static_pressure: ({ defaultValue: value }) => (
    <SuffixDisplay suffix="mm H₂O">{value}</SuffixDisplay>
  ),
  bearing: ({ defaultValue: value }) => value,
  connector: ({ defaultValue: value }) => value,
  rgb: ({ defaultValue: value }) => value,
};

export default InfoComponent(Components, Fan.Label, { strict: true });
