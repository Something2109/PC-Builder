import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { defaultParse, GenericInputField } from "../utils/Form";
import { Input } from "@/components/utils/Input";
import * as GPUSpec from "@/utils/part/info/GPUSpec";

const Components: InfoComponentObject<GPUSpec.DTO> = {
  family: (props) => <Input {...props} />,
  core_count: (props) => <Input type="number" {...props} />,
  execution_unit: (props) => <Input type="number" {...props} />,
  rops: (props) => <Input type="number" {...props} />,
  tmus: (props) => <Input type="number" {...props} />,
  ray_tracing: (props) => <Input type="number" {...props} />,
  tensor: (props) => <Input type="number" {...props} />,
};

function submit(formData: FormData) {
  return GPUSpec.Schemas.DTO.parse(defaultParse(formData));
}

export default GenericInputField(
  InfoComponent(Components, GPUSpec.Label),
  submit
);
