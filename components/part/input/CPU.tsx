import { GenericInputTable } from "../TableWrapper";
import { Input } from "@/components/utils/Input";
import CPU from "@/utils/interface/info/CPU";
import { FunctionComponent } from "react";

export const Components: {
  [key in keyof CPU.Info]: FunctionComponent<{ value?: CPU.Info[key] }>;
} = {
  family: ({ value }) => <Input name="family" defaultValue={value} />,
  socket: ({ value }) => <Input name="socket" defaultValue={value} />,
  total_cores: ({ value }) => (
    <Input type="number" name="total_cores" defaultValue={value} />
  ),
  total_threads: ({ value }) => (
    <Input type="number" name="total_threads" defaultValue={value} />
  ),
  base_frequency: ({ value }) => (
    <Input type="number" name="base_frequency" defaultValue={value} />
  ),
  turbo_frequency: ({ value }) => (
    <Input type="number" name="turbo_frequency" defaultValue={value} />
  ),
  cores: ({ value }) => <></>,
  L2_cache: ({ value }) => (
    <Input type="number" name="L2_cache" defaultValue={value} />
  ),
  L3_cache: ({ value }) => (
    <Input type="number" name="L3_cache" defaultValue={value} />
  ),
  max_memory: ({ value }) => (
    <Input type="number" name="max_memory" defaultValue={value} />
  ),
  max_memory_channel: ({ value }) => (
    <Input type="number" name="max_memory_channel" defaultValue={value} />
  ),
  max_memory_bandwidth: ({ value }) => (
    <Input type="number" name="max_memory_bandwidth" defaultValue={value} />
  ),
  tdp: ({ value }) => <Input type="number" name="tdp" defaultValue={value} />,
  lithography: ({ value }) => <Input name="lithography" defaultValue={value} />,
};

export default GenericInputTable(Components, CPU.Label);
