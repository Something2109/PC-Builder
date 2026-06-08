import { UnitDisplay } from "@/ui/Display";
import * as CaseSpec from "@/utils/part/info/CaseSpec";
import { LengthUnits } from "@/utils/Units";

import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<CaseSpec.DTO> = {
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
  expansion_slot: ({ defaultValue }) => defaultValue,
  max_cooler_height: ({ defaultValue }) => (
    <UnitDisplay
      Unit={LengthUnits}
      defaultUnit="mm"
      defaultValue={defaultValue}
    />
  ),
  max_psu_length: ({ defaultValue }) => (
    <UnitDisplay
      Unit={LengthUnits}
      defaultUnit="mm"
      defaultValue={defaultValue}
    />
  ),
};

export default InfoComponent(Components, CaseSpec.Label, { strict: true });
