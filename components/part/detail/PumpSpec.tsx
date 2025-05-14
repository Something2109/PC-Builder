import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import PumpSpec from "@/utils/interface/part/info/PumpSpec";
import { LengthUnits, VolumeSpeedUnit } from "@/utils/extract/Units";

const Components: InfoComponentObject<PumpSpec.Info> = {
  form_factor: ({ defaultValue }) => defaultValue,
  width: ({ defaultValue }) => (
    <UnitDisplay
      Unit={LengthUnits}
      defaultUnit="mm"
      defaultValue={defaultValue}
    />
  ),
  length: ({ defaultValue }) => (
    <UnitDisplay
      Unit={LengthUnits}
      defaultUnit="mm"
      defaultValue={defaultValue}
    />
  ),
  height: ({ defaultValue }) => (
    <UnitDisplay
      Unit={LengthUnits}
      defaultUnit="mm"
      defaultValue={defaultValue}
    />
  ),
  voltage: ({ defaultValue }) => (
    <SuffixDisplay suffix="V">{defaultValue}</SuffixDisplay>
  ),
  wattage: ({ defaultValue }) => (
    <SuffixDisplay suffix="W">{defaultValue}</SuffixDisplay>
  ),
  head_pressure: ({ defaultValue }) => (
    <SuffixDisplay suffix="m">{defaultValue}</SuffixDisplay>
  ),
  flow_rate: ({ defaultValue }) => (
    <UnitDisplay
      Unit={VolumeSpeedUnit}
      defaultUnit="L/h"
      defaultValue={defaultValue}
    />
  ),
  power_connector: ({ defaultValue }) => defaultValue,
  control_connector: ({ defaultValue }) => defaultValue,
  rgb: ({ defaultValue }) => defaultValue,
};

export default InfoComponent(Components, PumpSpec.Label, { strict: true });
