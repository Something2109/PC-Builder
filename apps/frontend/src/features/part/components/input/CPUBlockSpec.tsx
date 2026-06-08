import { ZodType } from "zod";

import { OptionSelect } from "@/ui/Input";
import { Material, InternalConnectors } from "@/utils/interface";
import * as CPUBlockSpec from "@/utils/part/info/CPUBlockSpec";

import { GenericSingleInputForm } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<CPUBlockSpec.DTO> = {
  plate: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={Material.Metal.options} {...props} />
  ),
  rgb: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={InternalConnectors.RGB.options} {...props} />
  ),
};

export default GenericSingleInputForm<CPUBlockSpec.DTO>(
  Components,
  CPUBlockSpec.Label,
  CPUBlockSpec.Schemas.DTO as ZodType<CPUBlockSpec.DTO, CPUBlockSpec.DTO>
);
