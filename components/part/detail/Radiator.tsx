import Radiator from "@/utils/interface/info/Radiator";
import { GenericDetailTable } from "../TableWrapper";
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

export default GenericDetailTable(Components, Radiator.Label);
