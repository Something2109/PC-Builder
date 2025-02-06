import { GenericDetailTable } from "../TableWrapper";
import HDD from "@/utils/interface/info/HDD";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof HDD.Info]: FunctionComponent<{ value: HDD.Info[key] }>;
} = {
  rotational_speed: ({ value }) => value,
  read_speed: ({ value }) => value,
  write_speed: ({ value }) => value,
  capacity: ({ value }) => value,
  cache: ({ value }) => value,
  form_factor: ({ value }) => value,
  interface: ({ value }) => value,
};

export default GenericDetailTable(Components, HDD.Label);
