import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { UnitDisplay } from "@/components/utils/Display";
import * as RadiatorSpec from "@/utils/part/info/RadiatorSpec";
import { LengthUnits } from "@/utils/Units";

const Components: InfoComponentObject<RadiatorSpec.DTO> = {
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
  fpi: ({ defaultValue }) => defaultValue,
  material: ({ defaultValue }) => defaultValue,
};

export default InfoComponent(Components, RadiatorSpec.Label, { strict: true });
