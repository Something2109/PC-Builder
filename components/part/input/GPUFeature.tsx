import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { GenericInputField } from "../utils/Form";
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
  const raw = Object.fromEntries(
    formData
      .entries()
      .map(([key, value]) => [
        key,
        value === "" || Number(value) === 0 ? undefined : value,
      ])
  ) as Record<string, string | string[]>;

  return GPUFeature.Schema.parse(raw)!;
}

export default GenericInputField(
  InfoComponent(Components, GPUFeature.Label),
  submit
);
