import { ZodType } from "zod";

import { Input } from "@/ui/Input";
import * as GPUSpec from "@/utils/part/info/GPUSpec";

import { GenericSingleInputForm } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<GPUSpec.DTO> = {
  family: ({ form: _, ...props }) => <Input {...props} />,
  core_count: ({ form: _, ...props }) => <Input type="number" {...props} />,
  execution_unit: ({ form: _, ...props }) => <Input type="number" {...props} />,
  rops: ({ form: _, ...props }) => <Input type="number" {...props} />,
  tmus: ({ form: _, ...props }) => <Input type="number" {...props} />,
  ray_tracing: ({ form: _, ...props }) => <Input type="number" {...props} />,
  tensor: ({ form: _, ...props }) => <Input type="number" {...props} />,
};

export default GenericSingleInputForm<GPUSpec.DTO>(
  Components,
  GPUSpec.Label,
  GPUSpec.Schemas.DTO as ZodType<GPUSpec.DTO, GPUSpec.DTO>
);
