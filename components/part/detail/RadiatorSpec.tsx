import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { UnitDisplay } from "@/components/utils/Display";
import RadiatorSpec from "@/utils/interface/part/info/RadiatorSpec";
import { LengthUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<RadiatorSpec.Info> = {
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
