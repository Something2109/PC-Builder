import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { defaultParse, GenericInputField } from "../utils/Form";
import { Input, SuffixInput } from "@/components/utils/Input";
import CPUSpec from "@/utils/interface/part/info/CPUSpec";

export const Components: InfoComponentObject<CPUSpec.DTO> = {
  family: (props) => <Input {...props} />,
  socket: (props) => <Input {...props} />,
  total_cores: (props) => (
    <SuffixInput suffix="Cores" type="number" {...props} />
  ),
  total_threads: (props) => (
    <SuffixInput suffix="Threads" type="number" {...props} />
  ),

  lithography: (props) => <Input {...props} />,
};

function submit(formData: FormData) {
  return CPUSpec.Schemas.DTO.parse(defaultParse(formData));
}

export default GenericInputField(
  InfoComponent(Components, CPUSpec.Label),
  submit
);
