import { ZodType } from "zod";

import { SuffixInput, UnitInput, OptionSelect } from "@/ui/Input";
import { FormFactor } from "@/utils/interface";
import * as PSUSpec from "@/utils/part/info/PSUSpec";
import { LengthUnits } from "@/utils/Units";

import { GenericSingleInputForm } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<PSUSpec.DTO> = {
  wattage: ({ form: _, ...props }) => <SuffixInput suffix="W" type="number" {...props} />,
  efficiency: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={PSUSpec.Efficiency.options} {...props} />
  ),
  form_factor: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={FormFactor.PSU.options} {...props} />
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
  modular: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={PSUSpec.Modular.options} {...props} />
  ),
};

export default GenericSingleInputForm<PSUSpec.DTO>(
  Components,
  PSUSpec.Label,
  PSUSpec.Schemas.DTO as ZodType<PSUSpec.DTO, PSUSpec.DTO>
);
