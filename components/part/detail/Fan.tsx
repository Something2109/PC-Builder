import { GenericDetailTable } from "../TableWrapper";
import Fan from "@/utils/interface/part/Fan";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof Fan.Info]: FunctionComponent<{ value: Fan.Info[key] }>;
} = {
  form_factor: ({ value }) => value,
  width: ({ value }) => value,
  length: ({ value }) => value,
  height: ({ value }) => value,
  count: ({ value }) => value,
  voltage: ({ value }) => value,
  speed: ({ value }) => value,
  airflow: ({ value }) => value,
  noise: ({ value }) => value,
  static_pressure: ({ value }) => value,
  bearing: ({ value }) => value,
  connector: ({ value }) => value,
  rgb: ({ value }) => value,
};

export default GenericDetailTable(Components, Fan.Label);
