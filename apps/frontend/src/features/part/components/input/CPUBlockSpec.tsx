import { Material, InternalConnectors } from "@pc-builder/shared/interface";
import * as CPUBlockSpec from "@pc-builder/shared/part/info/CPUBlockSpec";
import { ZodType } from "zod";

import { OptionSelect } from "@/ui/Input";

import { GenericSingleInputForm, mapChange } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<CPUBlockSpec.DTO> = {
  plate: (field) => (
    <OptionSelect options={Material.Metal.options} {...mapChange(field, "select")} />
  ),
  rgb: (field) => (
    <OptionSelect options={InternalConnectors.RGB.options} {...mapChange(field, "select")} />
  ),
};

export default GenericSingleInputForm<CPUBlockSpec.DTO>(
  Components,
  CPUBlockSpec.Label,
  CPUBlockSpec.Schemas.DTO as ZodType<CPUBlockSpec.DTO, CPUBlockSpec.DTO>
);
