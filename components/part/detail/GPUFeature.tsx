import { InfoComponent, InfoComponentObject } from "../utils/Table";
import GPUFeature from "@/utils/interface/part/info/GPUFeature";

const Components: InfoComponentObject<GPUFeature.Info> = {
  DirectX: ({ defaultValue }) => defaultValue,
  OpenGL: ({ defaultValue }) => defaultValue,
  OpenCL: ({ defaultValue }) => defaultValue,
  Vulkan: ({ defaultValue }) => defaultValue,
  CUDA: ({ defaultValue }) => defaultValue,
};

export default InfoComponent(Components, GPUFeature.Label, { strict: true });
