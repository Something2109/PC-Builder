import { FormFactor } from "@pc-builder/shared/interface";
import * as CaseSpec from "@pc-builder/shared/part/info/CaseSpec";
import { LengthUnits } from "@pc-builder/shared/Units";
import { ZodType } from "zod";

import { Input, UnitInput, OptionSelect } from "@/ui/Input";

import { GenericSingleInputForm, mapChange } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<CaseSpec.DTO> = {
  form_factor: (field) => (
    <OptionSelect options={FormFactor.Case.options} {...mapChange(field, "select")} />
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
  expansion_slot: (field) => <Input type="number" {...mapChange(field, "number")} />,
  max_cooler_height: (field) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...mapChange(field, "number")} />
  ),
  max_psu_length: (field) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...mapChange(field, "number")} />
  ),
};

export default GenericSingleInputForm<CaseSpec.DTO>(
  Components,
  CaseSpec.Label,
  CaseSpec.Schemas.DTO as ZodType<CaseSpec.DTO, CaseSpec.DTO>
);
