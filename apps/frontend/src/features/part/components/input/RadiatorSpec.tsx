import { ZodType } from "zod";

import { Input, UnitInput, OptionSelect } from "@/ui/Input";
import { FormFactor, Material } from "@pc-builder/shared/interface";
import * as RadiatorSpec from "@pc-builder/shared/part/info/RadiatorSpec";
import { LengthUnits } from "@pc-builder/shared/Units";

import { GenericSingleInputForm, mapChange } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<RadiatorSpec.DTO> = {
  form_factor: (field) => (
    <OptionSelect options={FormFactor.Radiator.options} {...mapChange(field, "select")} />
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
  fpi: (field) => <Input type="number" {...mapChange(field, "number")} />,
  material: (field) => (
    <OptionSelect options={Material.Metal.options} {...mapChange(field, "select")} />
  ),
};

export default GenericSingleInputForm<RadiatorSpec.DTO>(
  Components,
  RadiatorSpec.Label,
  RadiatorSpec.Schemas.DTO as ZodType<RadiatorSpec.DTO, RadiatorSpec.DTO>
);
