import { ZodType } from "zod";

import { Input, UnitInput, OptionSelect } from "@/ui/Input";
import { FormFactor } from "@/utils/interface";
import * as CaseSpec from "@/utils/part/info/CaseSpec";
import { LengthUnits } from "@/utils/Units";

import { GenericSingleInputForm } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<CaseSpec.DTO> = {
  form_factor: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={FormFactor.Case.options} {...props} />
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
  expansion_slot: ({ form: _, ...props }) => <Input type="number" {...props} />,
  max_cooler_height: ({ form: _, ...props }) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  max_psu_length: ({ form: _, ...props }) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
};

export default GenericSingleInputForm<CaseSpec.DTO>(
  Components,
  CaseSpec.Label,
  CaseSpec.Schemas.DTO as ZodType<CaseSpec.DTO, CaseSpec.DTO>
);
