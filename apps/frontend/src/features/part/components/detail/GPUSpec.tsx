import * as GPUSpec from "@/utils/part/info/GPUSpec";

import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<GPUSpec.DTO> = {
  family: ({ defaultValue }) => defaultValue,
  core_count: ({ defaultValue }) => defaultValue,
  execution_unit: ({ defaultValue }) => defaultValue,
  rops: ({ defaultValue }) => defaultValue,
  tmus: ({ defaultValue }) => defaultValue,
  ray_tracing: ({ defaultValue }) => defaultValue,
  tensor: ({ defaultValue }) => defaultValue,
};

export default InfoComponent(Components, GPUSpec.Label, { strict: true });
