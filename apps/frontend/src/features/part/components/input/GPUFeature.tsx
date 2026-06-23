import * as GPUFeature from "@pc-builder/shared/part/info/GPUFeature";
import { ZodType } from "zod";

import { Input } from "@/ui/Input";

import { GenericSingleInputForm, mapChange } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<GPUFeature.DTO> = {
  DirectX: (field) => <Input {...mapChange(field, "string")} />,
  OpenGL: (field) => <Input {...mapChange(field, "string")} />,
  OpenCL: (field) => <Input {...mapChange(field, "string")} />,
  Vulkan: (field) => <Input {...mapChange(field, "string")} />,
  CUDA: (field) => <Input {...mapChange(field, "string")} />,
};

export default GenericSingleInputForm<GPUFeature.DTO>(
  Components,
  GPUFeature.Label,
  GPUFeature.Schemas.DTO as ZodType<GPUFeature.DTO, GPUFeature.DTO>
);
