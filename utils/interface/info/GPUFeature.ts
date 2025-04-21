import { Primitive } from "../utils";
import { z } from "zod";

namespace GPUFeature {
  export const Schema = z.object({
    DirectX: Primitive.String,
    OpenGL: Primitive.String,
    OpenCL: Primitive.String,
    Vulkan: Primitive.String,
    CUDA: Primitive.String,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    DirectX: "DirectX",
    OpenGL: "OpenGL",
    OpenCL: "OpenCL",
    Vulkan: "Vulkan",
    CUDA: "CUDA",
  };
}

export default GPUFeature;
