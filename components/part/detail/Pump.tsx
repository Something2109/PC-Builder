import Pump from "@/utils/interface/part/info/Pump";
import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import { LengthUnits, VolumeSpeedUnit } from "@/utils/extract/Units";

const Components: InfoComponentObject<Pump.Info> = {
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
  voltage: ({ value }) => <SuffixDisplay suffix="V">{value}</SuffixDisplay>,
  wattage: ({ value }) => <SuffixDisplay suffix="W">{value}</SuffixDisplay>,
  head_pressure: ({ value }) => (
    <SuffixDisplay suffix="m">{value}</SuffixDisplay>
  ),
  flow_rate: ({ value }) => (
    <UnitDisplay
      Unit={VolumeSpeedUnit}
      defaultUnit="L/h"
      defaultValue={value}
    />
  ),
  power_connector: ({ value }) => value,
  control_connector: ({ value }) => value,
  rgb: ({ value }) => value,
};

export default InfoComponent(Components, Pump.Label, { strict: true });
