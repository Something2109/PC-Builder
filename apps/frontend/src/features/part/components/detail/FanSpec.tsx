import { SuffixDisplay, UnitDisplay } from "@/ui/Display";
import * as FanSpec from "@/utils/part/info/FanSpec";
import { LengthUnits } from "@/utils/Units";

import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<FanSpec.DTO> = {
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
  count: ({ defaultValue }) => defaultValue,
  voltage: ({ defaultValue }) => (
    <SuffixDisplay suffix="V">{defaultValue}</SuffixDisplay>
  ),
  speed: ({ defaultValue }) => (
    <SuffixDisplay suffix="RPM">{defaultValue}</SuffixDisplay>
  ),
  airflow: ({ defaultValue }) => (
    <SuffixDisplay suffix="CFM">{defaultValue}</SuffixDisplay>
  ),
  noise: ({ defaultValue }) => (
    <SuffixDisplay suffix="dBA">{defaultValue}</SuffixDisplay>
  ),
  static_pressure: ({ defaultValue }) => (
    <SuffixDisplay suffix="mm H₂O">{defaultValue}</SuffixDisplay>
  ),
  bearing: ({ defaultValue }) => defaultValue,
  connector: ({ defaultValue }) => defaultValue,
  rgb: ({ defaultValue }) => defaultValue,
};

export default InfoComponent(Components, FanSpec.Label, { strict: true });
