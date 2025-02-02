import Pump from "@/utils/interface/part/Pump";
import { GenericSummaryCells } from "../TableWrapper";
import { FunctionComponent } from "react";

const Components: {
  [key in Pump.Summarizable]: FunctionComponent<{ value?: Pump.Info[key] }>;
} = {
  head_pressure: ({ value }) => value,
  flow_rate: ({ value }) => value,
  power_connector: ({ value }) => value,
};

export default GenericSummaryCells(Components, Pump.Label);
