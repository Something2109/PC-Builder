import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import PSUSpec from "@/utils/interface/part/info/PSUSpec";
import { LengthUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<PSUSpec.Info> = {
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
