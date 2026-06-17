import { ZodType } from "zod";

import { SuffixInput, UnitInput, OptionSelect } from "@/ui/Input";
import { FormFactor } from "@/utils/interface";
import * as PSUSpec from "@/utils/part/info/PSUSpec";
import { LengthUnits } from "@/utils/Units";

import { GenericSingleInputForm, mapChange } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<PSUSpec.DTO> = {
  wattage: (field) => <SuffixInput suffix="W" type="number" {...mapChange(field, "number")} />,
  efficiency: (field) => (
    <OptionSelect options={PSUSpec.Efficiency.options} {...mapChange(field, "select")} />
  ),
  form_factor: (field) => (
    <OptionSelect options={FormFactor.PSU.options} {...mapChange(field, "select")} />
  ),
  width: (field) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...mapChange(field, "number")} />
  ),
  length: (field) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...mapChange(field, "number")} />
  ),
  height: (field) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...mapChange(field, "number")} />
  ),
  modular: (field) => (
    <OptionSelect options={PSUSpec.Modular.options} {...mapChange(field, "select")} />
  ),
};

export default GenericSingleInputForm<PSUSpec.DTO>(
  Components,
  PSUSpec.Label,
  PSUSpec.Schemas.DTO as ZodType<PSUSpec.DTO, PSUSpec.DTO>
);
