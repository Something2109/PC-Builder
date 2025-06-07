import { createDTO, createModel, Primitive } from "../../utils";
import { z } from "zod";

namespace GPUFeature {
  const Info = z.object({
    DirectX: Primitive.String,
    OpenGL: Primitive.String,
    OpenCL: Primitive.String,
    Vulkan: Primitive.String,
    CUDA: Primitive.String,
  });

  export type Info = z.infer<typeof Info>;

  export const Label: { [key in keyof Info]: string } = {
    DirectX: "DirectX",
    OpenGL: "OpenGL",
    OpenCL: "OpenCL",
    Vulkan: "Vulkan",
    CUDA: "CUDA",
  };

  const Model = createModel(Info);

  export type Model = z.infer<typeof Model>;

  const DTO = createDTO(Info);

  export type DTO = z.infer<typeof DTO>;

  export const Schemas = { Info, Model, DTO };
}

export default GPUFeature;
