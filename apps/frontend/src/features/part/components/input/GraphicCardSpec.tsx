import { ZodType } from "zod";

import { Input, OptionSelect, SuffixInput, UnitInput } from "@/ui/Input";
import { InternalConnectors } from "@/utils/interface";
import * as GraphicCardSpec from "@/utils/part/info/GraphicCardSpec";
import { LengthUnits } from "@/utils/Units";

import { GenericSingleInputForm, mapChange } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<GraphicCardSpec.DTO> = {
  width: (field) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...mapChange(field, "number")} />
  ),
  length: (field) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...mapChange(field, "number")} />
  ),
  height: (field) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...mapChange(field, "number")} />
  ),
  pcie: (field) => <Input type="number" {...mapChange(field, "number")} />,
  minimum_psu: (field) => <SuffixInput suffix="W" type="number" {...mapChange(field, "number")} />,
  power_connector: (field) => (
    <OptionSelect
      options={InternalConnectors.Power.GraphicCard.options}
      {...mapChange(field, "select")}
    />
  ),
  power_connector_count: (field) => <Input type="number" {...mapChange(field, "number")} />,
};

export default GenericSingleInputForm<GraphicCardSpec.DTO>(
  Components,
  GraphicCardSpec.Label,
  GraphicCardSpec.Schemas.DTO as ZodType<GraphicCardSpec.DTO, GraphicCardSpec.DTO>
);
