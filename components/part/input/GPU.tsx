import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { Input } from "@/components/utils/Input";
import GPU from "@/utils/interface/info/GPU";

const Components: InfoInputMapping<GPU.Info> = {
  family: (props) => <Input {...props} />,
  core_count: (props) => <Input type="number" {...props} />,
  execution_unit: (props) => <Input type="number" {...props} />,
  base_frequency: (props) => <Input type="number" step={0.01} {...props} />,
  boost_frequency: (props) => <Input type="number" step={0.01} {...props} />,
  extra_cores: (props) => <></>,
  memory_size: (props) => <Input type="number" {...props} />,
  memory_type: (props) => <Input {...props} />,
  memory_bus: (props) => <Input type="number" {...props} />,
  tdp: (props) => <Input type="number" {...props} />,
  features: (props) => <></>,
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return GPU.Schema.partial().parse(raw);
}

export default GenericInputTable(Components, GPU.Label, submit);
