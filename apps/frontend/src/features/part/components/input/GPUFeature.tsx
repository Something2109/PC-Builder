import { Input } from "@/ui/Input";
import * as GPUFeature from "@/utils/part/info/GPUFeature";

import { defaultParse, GenericInputField } from "../utils/Form";
import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<GPUFeature.DTO> = {
  DirectX: (props) => <Input {...props} />,
  OpenGL: (props) => <Input {...props} />,
  OpenCL: (props) => <Input {...props} />,
  Vulkan: (props) => <Input {...props} />,
  CUDA: (props) => <Input {...props} />,
};

function submit(formData: FormData) {
  return GPUFeature.Schemas.DTO.parse(defaultParse(formData));
}

export default GenericInputField(
  InfoComponent(Components, GPUFeature.Label),
  submit
);
