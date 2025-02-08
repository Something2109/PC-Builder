import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { Input } from "@/components/utils/Input";
import CPU from "@/utils/interface/info/CPU";

export const Components: InfoInputMapping<CPU.Info> = {
  family: (props) => <Input {...props} />,
  socket: (props) => <Input {...props} />,
  total_cores: (props) => <Input type="number" {...props} />,
  total_threads: (props) => <Input type="number" {...props} />,
  base_frequency: (props) => <Input type="number" step={0.01} {...props} />,
  turbo_frequency: (props) => <Input type="number" step={0.01} {...props} />,
  cores: (props) => <></>,
  L2_cache: (props) => <Input type="number" {...props} />,
  L3_cache: (props) => <Input type="number" {...props} />,
  max_memory: (props) => <Input type="number" {...props} />,
  max_memory_channel: (props) => <Input type="number" {...props} />,
  max_memory_bandwidth: (props) => <Input type="number" {...props} />,
  tdp: (props) => <Input type="number" {...props} />,
  lithography: (props) => <Input {...props} />,
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return raw;
}
export default GenericInputTable(Components, CPU.Label, submit);
