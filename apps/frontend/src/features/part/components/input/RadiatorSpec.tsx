import { ZodType } from "zod";

import { Input, UnitInput, OptionSelect } from "@/ui/Input";
import { FormFactor, Material } from "@/utils/interface";
import * as RadiatorSpec from "@/utils/part/info/RadiatorSpec";
import { LengthUnits } from "@/utils/Units";

import { GenericSingleInputForm } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<RadiatorSpec.DTO> = {
  form_factor: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={FormFactor.Radiator.options} {...props} />
  ),
  width: ({ form: _, ...props }) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  length: ({ form: _, ...props }) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  height: ({ form: _, ...props }) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  fpi: ({ form: _, ...props }) => <Input type="number" {...props} />,
  material: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={Material.Metal.options} {...props} />
  ),
};

export default GenericSingleInputForm<RadiatorSpec.DTO>(
  Components,
  RadiatorSpec.Label,
  RadiatorSpec.Schemas.DTO as ZodType<RadiatorSpec.DTO, RadiatorSpec.DTO>
);
