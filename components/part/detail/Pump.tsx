import Pump from "@/utils/interface/part/info/Pump";
import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import { LengthUnits, VolumeSpeedUnit } from "@/utils/extract/Units";

const Components: InfoComponentObject<Pump.Info> = {
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
  voltage: ({ defaultValue: value }) => (
    <SuffixDisplay suffix="V">{value}</SuffixDisplay>
  ),
  wattage: ({ defaultValue: value }) => (
    <SuffixDisplay suffix="W">{value}</SuffixDisplay>
  ),
  head_pressure: ({ defaultValue: value }) => (
    <SuffixDisplay suffix="m">{value}</SuffixDisplay>
  ),
  flow_rate: ({ defaultValue: value }) => (
    <UnitDisplay
      Unit={VolumeSpeedUnit}
      defaultUnit="L/h"
      defaultValue={value}
    />
  ),
  power_connector: ({ defaultValue: value }) => value,
  control_connector: ({ defaultValue: value }) => value,
  rgb: ({ defaultValue: value }) => value,
};

export default InfoComponent(Components, Pump.Label, { strict: true });
