import { ZodType } from "zod";

import { Input, SuffixInput } from "@/ui/Input";
import * as CPUSpec from "@/utils/part/info/CPUSpec";

import { GenericSingleInputForm, mapChange } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

export const Components: InfoComponentObject<CPUSpec.DTO> = {
  family: (field) => (
    <Input
      {...mapChange(field, "string")}
    />
  ),
  socket: (field) => (
    <Input
      {...mapChange(field, "string")}
    />
  ),
  total_cores: (field) => (
    <SuffixInput
      suffix="Cores"
      type="number"
      {...mapChange(field, "number")}
    />
  ),
  total_threads: (field) => (
    <SuffixInput
      suffix="Threads"
      type="number"
      {...mapChange(field, "number")}
    />
  ),

  lithography: (field) => (
    <Input
      {...mapChange(field, "string")}
    />
  ),
};

export default GenericSingleInputForm<CPUSpec.DTO>(
  Components,
  CPUSpec.Label,
  CPUSpec.Schemas.DTO as ZodType<CPUSpec.DTO, CPUSpec.DTO>
);
