import * as GPUFeature from "@pc-builder/shared/part/info/GPUFeature";

import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<GPUFeature.DTO> = {
  DirectX: ({ defaultValue }) => defaultValue,
  OpenGL: ({ defaultValue }) => defaultValue,
  OpenCL: ({ defaultValue }) => defaultValue,
  Vulkan: ({ defaultValue }) => defaultValue,
  CUDA: ({ defaultValue }) => defaultValue,
};

export default InfoComponent(Components, GPUFeature.Label, { strict: true });
