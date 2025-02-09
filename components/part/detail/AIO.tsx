import { GenericDetailTable } from "../TableWrapper";
import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import { LengthUnits } from "@/utils/extract/Units";
import AIO from "@/utils/interface/info/AIO";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof AIO.Info]: FunctionComponent<{ value: AIO.Info[key] }>;
} = {
  form_factor: ({ value }) => value,
  socket: ({ value }) => value,
  cpu_plate: ({ value }) => value,
  radiator_width: ({ value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  radiator_length: ({ value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  radiator_height: ({ value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  pump_width: ({ value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  pump_length: ({ value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  pump_height: ({ value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  pump_speed: ({ value }) => (
    <SuffixDisplay suffix="RPM">{value}</SuffixDisplay>
  ),
};

export default GenericDetailTable(Components, AIO.Label);
