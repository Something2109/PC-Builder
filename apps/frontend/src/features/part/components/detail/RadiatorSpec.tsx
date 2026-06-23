import * as RadiatorSpec from "@pc-builder/shared/part/info/RadiatorSpec";
import { LengthUnits } from "@pc-builder/shared/Units";

import { UnitDisplay } from "@/ui/Display";

import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<RadiatorSpec.DTO> = {
  form_factor: ({ defaultValue }) => defaultValue,
  width: ({ defaultValue }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={defaultValue} />
  ),
  length: ({ defaultValue }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={defaultValue} />
  ),
  height: ({ defaultValue }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={defaultValue} />
  ),
  fpi: ({ defaultValue }) => defaultValue,
  material: ({ defaultValue }) => defaultValue,
};

export default InfoComponent(Components, RadiatorSpec.Label, { strict: true });
