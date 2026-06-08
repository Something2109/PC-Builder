import { ZodType } from "zod";

import { SuffixInput, UnitInput, OptionSelect } from "@/ui/Input";
import { FormFactor, InternalConnectors } from "@/utils/interface";
import * as HDDSpec from "@/utils/part/info/HDDSpec";
import { MemoryUnits } from "@/utils/Units";

import { GenericSingleInputForm } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<HDDSpec.DTO> = {
  rotational_speed: ({ form: _, ...props }) => (
    <SuffixInput suffix="RPM" type="number" {...props} />
  ),
  capacity: ({ form: _, ...props }) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="GB" {...props} />
  ),
  form_factor: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={FormFactor.HDD.options} {...props} />
  ),
  interface: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={InternalConnectors.Storage.HDD.options} {...props} />
  ),
};

export default GenericSingleInputForm<HDDSpec.DTO>(
  Components,
  HDDSpec.Label,
  HDDSpec.Schemas.DTO as ZodType<HDDSpec.DTO, HDDSpec.DTO>
);
