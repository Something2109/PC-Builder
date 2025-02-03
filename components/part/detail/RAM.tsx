import RAM from "@/utils/interface/part/RAM";
import { FunctionComponent } from "react";
import { GenericDetailTable } from "../TableWrapper";

const Components: {
  [key in keyof RAM.Info]: FunctionComponent<{ value: RAM.Info[key] }>;
} = {
  speed: ({ value }) => value,
  capacity: ({ value }) => value,
  voltage: ({ value }) => value,
  latency: ({ value }) => value.map((val) => val.toString()).join(" - "),
  kit: ({ value }) => value,
  form_factor: ({ value }) => value,
  interface: ({ value }) => value,
};

export default GenericDetailTable(Components, RAM.Label);
