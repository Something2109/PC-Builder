import { ZodType } from "zod";

import { SuffixInput, UnitInput, OptionSelect } from "@/ui/Input";
import { FormFactor, InternalConnectors } from "@/utils/interface";
import * as HDDSpec from "@/utils/part/info/HDDSpec";
import { MemoryUnits } from "@/utils/Units";

import { GenericSingleInputForm, mapChange } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<HDDSpec.DTO> = {
  rotational_speed: (field) => (
    <SuffixInput
      suffix="RPM"
      type="number"
      {...mapChange(field, "number")}
    />
  ),
  capacity: (field) => (
    <UnitInput
      Unit={MemoryUnits}
      defaultUnit="GB"
      {...mapChange(field, "number")}
    />
  ),
  form_factor: (field) => (
    <OptionSelect
      options={FormFactor.HDD.options}
      {...mapChange(field, "select")}
    />
  ),
  interface: (field) => (
    <OptionSelect
      options={InternalConnectors.Storage.HDD.options}
      {...mapChange(field, "select")}
    />
  ),
};

export default GenericSingleInputForm<HDDSpec.DTO>(
  Components,
  HDDSpec.Label,
  HDDSpec.Schemas.DTO as ZodType<HDDSpec.DTO, HDDSpec.DTO>
);
