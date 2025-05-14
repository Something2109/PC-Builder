import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { GenericInputField } from "../utils/Form";
import { Input } from "@/components/utils/Input";
import GPUSpec from "@/utils/interface/part/info/GPUSpec";

const Components: InfoComponentObject<GPUSpec.Info> = {
  family: (props) => <Input {...props} />,
  core_count: (props) => <Input type="number" {...props} />,
  execution_unit: (props) => <Input type="number" {...props} />,
  rops: (props) => <Input type="number" {...props} />,
  tmus: (props) => <Input type="number" {...props} />,
  ray_tracing: (props) => <Input type="number" {...props} />,
  tensor: (props) => <Input type="number" {...props} />,
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

  return GPUSpec.Schema.parse(raw)!;
}

export default GenericInputField(
  InfoComponent(Components, GPUSpec.Label),
  submit
);
