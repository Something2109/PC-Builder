import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import { LengthUnits } from "@/utils/extract/Units";
import AIO from "@/utils/interface/part/info/AIO";

const Components: InfoComponentObject<AIO.Info> = {
  form_factor: ({ defaultValue: value }) => value,
  socket: ({ defaultValue: value }) => value,
  cpu_plate: ({ defaultValue: value }) => value,
  radiator_width: ({ defaultValue: value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  radiator_length: ({ defaultValue: value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  radiator_height: ({ defaultValue: value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  pump_width: ({ defaultValue: value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  pump_length: ({ defaultValue: value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  pump_height: ({ defaultValue: value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  pump_speed: ({ defaultValue: value }) => (
    <SuffixDisplay suffix="RPM">{value}</SuffixDisplay>
  ),
};

export default InfoComponent(Components, AIO.Label, { strict: true });
