import { ZodType } from "zod";

import { Input } from "@/ui/Input";
import * as GPUFeature from "@/utils/part/info/GPUFeature";

import { GenericSingleInputForm } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<GPUFeature.DTO> = {
  DirectX: ({ form: _, ...props }) => <Input {...props} />,
  OpenGL: ({ form: _, ...props }) => <Input {...props} />,
  OpenCL: ({ form: _, ...props }) => <Input {...props} />,
  Vulkan: ({ form: _, ...props }) => <Input {...props} />,
  CUDA: ({ form: _, ...props }) => <Input {...props} />,
};

export default GenericSingleInputForm<GPUFeature.DTO>(
  Components,
  GPUFeature.Label,
  GPUFeature.Schemas.DTO as ZodType<GPUFeature.DTO, GPUFeature.DTO>
);
