import { ZodType } from "zod";

import { Input, SuffixInput } from "@/ui/Input";
import * as CPUSpec from "@/utils/part/info/CPUSpec";

import { GenericSingleInputForm } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

export const Components: InfoComponentObject<CPUSpec.DTO> = {
  family: ({ form: _, ...props }) => <Input {...props} />,
  socket: ({ form: _, ...props }) => <Input {...props} />,
  total_cores: ({ form: _, ...props }) => (
    <SuffixInput suffix="Cores" type="number" {...props} />
  ),
  total_threads: ({ form: _, ...props }) => (
    <SuffixInput suffix="Threads" type="number" {...props} />
  ),

  lithography: ({ form: _, ...props }) => <Input {...props} />,
};

export default GenericSingleInputForm<CPUSpec.DTO>(
  Components,
  CPUSpec.Label,
  CPUSpec.Schemas.DTO as ZodType<CPUSpec.DTO, CPUSpec.DTO>
);
