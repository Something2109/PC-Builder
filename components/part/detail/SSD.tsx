import { GenericTable } from "../TableWrapper";
import SSD from "@/utils/interface/part/SSD";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof SSD.Info]: FunctionComponent<{ value: SSD.Info[key] }>;
} = {
  memory_type: ({ value }) => value,
  read_speed: ({ value }) => value,
  write_speed: ({ value }) => value,
  capacity: ({ value }) => value,
  cache: ({ value }) => value,
  tbw: ({ value }) => value,
  form_factor: ({ value }) => value,
  interface: ({ value }) => value,
};

export default GenericTable(Components, SSD.Label);
