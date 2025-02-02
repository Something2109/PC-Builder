import { GenericTable } from "../TableWrapper";
import { Input } from "@/components/utils/Input";
import GPU from "@/utils/interface/part/GPU";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof GPU.Info]: FunctionComponent<{ value?: GPU.Info[key] }>;
} = {
  family: ({ value }) => <Input name="family" defaultValue={value} />,
  core_count: ({ value }) => (
    <Input type="number" name="core_count" defaultValue={value} />
  ),
  execution_unit: ({ value }) => (
    <Input type="number" name="execution_unit" defaultValue={value} />
  ),
  base_frequency: ({ value }) => (
    <Input type="number" name="base_frequency" defaultValue={value} />
  ),
  boost_frequency: ({ value }) => (
    <Input type="number" name="boost_frequency" defaultValue={value} />
  ),
  extra_cores: ({ value }) => <></>,
  memory_size: ({ value }) => (
    <Input type="number" name="memory_size" defaultValue={value} />
  ),
  memory_type: ({ value }) => <Input name="memory_type" defaultValue={value} />,
  memory_bus: ({ value }) => (
    <Input type="number" name="memory_bus" defaultValue={value} />
  ),
  tdp: ({ value }) => <Input type="number" name="tdp" defaultValue={value} />,
  features: ({ value }) => <></>,
};

export default GenericTable(Components, GPU.Label);
