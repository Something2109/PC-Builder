import { SuffixDisplay, UnitDisplay } from "@/ui/Display";
import * as GraphicCardSpec from "@pc-builder/shared/part/info/GraphicCardSpec";
import { LengthUnits } from "@pc-builder/shared/Units";

import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<GraphicCardSpec.DTO> = {
  width: ({ defaultValue }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={defaultValue} />
  ),
  length: ({ defaultValue }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={defaultValue} />
  ),
  height: ({ defaultValue }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={defaultValue} />
  ),
  pcie: ({ defaultValue }) => defaultValue,
  minimum_psu: ({ defaultValue }) => <SuffixDisplay suffix="W">{defaultValue}</SuffixDisplay>,
  power_connector: ({ defaultValue }) => defaultValue,
  power_connector_count: ({ defaultValue }) => defaultValue,
};

export default InfoComponent(Components, GraphicCardSpec.Label, {
  strict: true,
});
