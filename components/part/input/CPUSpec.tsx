import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { GenericInputField } from "../utils/Form";
import { Input, SuffixInput } from "@/components/utils/Input";
import CPUSpec from "@/utils/interface/part/info/CPUSpec";

export const Components: InfoComponentObject<CPUSpec.Info> = {
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
  const raw = Object.fromEntries(
    formData
      .entries()
      .map(([key, value]) => [
        key,
        value === "" || Number(value) === 0 ? undefined : value,
      ])
  ) as Record<string, string | string[]>;

  return CPUSpec.Schema.parse(raw)!;
}

export default GenericInputField(
  InfoComponent(Components, CPUSpec.Label),
  submit
);
