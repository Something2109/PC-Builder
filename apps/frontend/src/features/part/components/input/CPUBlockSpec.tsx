import { ZodType } from "zod";

import { OptionSelect } from "@/ui/Input";
import { Material, InternalConnectors } from "@/utils/interface";
import * as CPUBlockSpec from "@/utils/part/info/CPUBlockSpec";

import { GenericSingleInputForm, mapChange } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<CPUBlockSpec.DTO> = {
  plate: (field) => (
    <OptionSelect
      options={Material.Metal.options}
      {...mapChange(field, "select")}
    />
  ),
  rgb: (field) => (
    <OptionSelect
      options={InternalConnectors.RGB.options}
      {...mapChange(field, "select")}
    />
  ),
};

export default GenericSingleInputForm<CPUBlockSpec.DTO>(
  Components,
  CPUBlockSpec.Label,
  CPUBlockSpec.Schemas.DTO as ZodType<CPUBlockSpec.DTO, CPUBlockSpec.DTO>
);
