import { GenericDetailTable } from "../TableWrapper";
import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import Fan from "@/utils/interface/info/Fan";
import { LengthUnits } from "@/utils/extract/Units";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof Fan.Info]: FunctionComponent<{ value: Fan.Info[key] }>;
} = {
  form_factor: ({ value }) => value,
  width: ({ value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  length: ({ value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  height: ({ value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  count: ({ value }) => value,
  voltage: ({ value }) => <SuffixDisplay suffix="V">{value}</SuffixDisplay>,
  speed: ({ value }) => <SuffixDisplay suffix="RPM">{value}</SuffixDisplay>,
  airflow: ({ value }) => <SuffixDisplay suffix="CFM">{value}</SuffixDisplay>,
  noise: ({ value }) => <SuffixDisplay suffix="dBA">{value}</SuffixDisplay>,
  static_pressure: ({ value }) => (
    <SuffixDisplay suffix="mm H₂O">{value}</SuffixDisplay>
  ),
  bearing: ({ value }) => value,
  connector: ({ value }) => value,
  rgb: ({ value }) => value,
};

export default GenericDetailTable(Components, Fan.Label);
