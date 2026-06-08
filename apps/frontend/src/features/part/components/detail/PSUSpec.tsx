import { SuffixDisplay, UnitDisplay } from "@/ui/Display";
import * as PSUSpec from "@/utils/part/info/PSUSpec";
import { LengthUnits } from "@/utils/Units";

import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<PSUSpec.DTO> = {
  wattage: ({ defaultValue }) => (
    <SuffixDisplay suffix="W">{defaultValue}</SuffixDisplay>
  ),
  efficiency: ({ defaultValue }) => defaultValue,
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
  modular: ({ defaultValue }) => defaultValue,
};

export default InfoComponent(Components, PSUSpec.Label, { strict: true });
