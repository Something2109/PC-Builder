import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { defaultParse, GenericInputField } from "../utils/Form";
import { Input } from "@/components/utils/Input";
import GPUFeature from "@/utils/interface/part/info/GPUFeature";

const Components: InfoComponentObject<GPUFeature.Info> = {
  DirectX: (props) => <Input {...props} />,
  OpenGL: (props) => <Input {...props} />,
  OpenCL: (props) => <Input {...props} />,
  Vulkan: (props) => <Input {...props} />,
  CUDA: (props) => <Input {...props} />,
};

function submit(formData: FormData) {
  return GPUFeature.Schema.partial().parse(defaultParse(formData))!;
}

export default GenericInputField(
  InfoComponent(Components, GPUFeature.Label),
  submit
);
