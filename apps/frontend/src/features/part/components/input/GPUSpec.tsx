import { ZodType } from "zod";

import { Input } from "@/ui/Input";
import * as GPUSpec from "@/utils/part/info/GPUSpec";

import { GenericSingleInputForm, mapChange } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<GPUSpec.DTO> = {
  family: (field) => (
    <Input
      {...mapChange(field, "string")}
    />
  ),
  core_count: (field) => (
    <Input
      type="number"
      {...mapChange(field, "number")}
    />
  ),
  execution_unit: (field) => (
    <Input
      type="number"
      {...mapChange(field, "number")}
    />
  ),
  rops: (field) => (
    <Input
      type="number"
      {...mapChange(field, "number")}
    />
  ),
  tmus: (field) => (
    <Input
      type="number"
      {...mapChange(field, "number")}
    />
  ),
  ray_tracing: (field) => (
    <Input
      type="number"
      {...mapChange(field, "number")}
    />
  ),
  tensor: (field) => (
    <Input
      type="number"
      {...mapChange(field, "number")}
    />
  ),
};

export default GenericSingleInputForm<GPUSpec.DTO>(
  Components,
  GPUSpec.Label,
  GPUSpec.Schemas.DTO as ZodType<GPUSpec.DTO, GPUSpec.DTO>
);
