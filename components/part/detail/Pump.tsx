import Pump from "@/utils/interface/part/Pump";
import { GenericDetailTable } from "../TableWrapper";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof Pump.Info]: FunctionComponent<{ value: Pump.Info[key] }>;
} = {
  form_factor: ({ value }) => value,
  width: ({ value }) => value,
  length: ({ value }) => value,
  height: ({ value }) => value,
  voltage: ({ value }) => value,
  wattage: ({ value }) => value,
  head_pressure: ({ value }) => value,
  flow_rate: ({ value }) => value,
  power_connector: ({ value }) => value,
  control_connector: ({ value }) => value,
  rgb: ({ value }) => value,
};

export default GenericDetailTable(Components, Pump.Label);
