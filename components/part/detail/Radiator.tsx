import Radiator from "@/utils/interface/part/Radiator";
import { GenericTable } from "../TableWrapper";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof Radiator.Info]: FunctionComponent<{
    value: Radiator.Info[key];
  }>;
} = {
  form_factor: ({ value }) => value,
  width: ({ value }) => value,
  length: ({ value }) => value,
  height: ({ value }) => value,
  fpi: ({ value }) => value,
  material: ({ value }) => value,
};

export default GenericTable(Components, Radiator.Label);
