import Radiator from "@/utils/interface/part/Radiator";
import { TableRowWrapper } from "../TableWrapper";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof Radiator.Info]: FunctionComponent<{
    value: Radiator.Info[key];
  }>;
} = {
  form_factor: ({ value }) => (
    <TableRowWrapper>Form Factor {value}</TableRowWrapper>
  ),
  width: ({ value }) => <TableRowWrapper>Width {value}</TableRowWrapper>,
  length: ({ value }) => <TableRowWrapper>Length {value}</TableRowWrapper>,
  height: ({ value }) => <TableRowWrapper>Height {value}</TableRowWrapper>,
  fpi: ({ value }) => <TableRowWrapper>FPI {value}</TableRowWrapper>,
  material: ({ value }) => <TableRowWrapper>Material {value}</TableRowWrapper>,
};

export { Components as RadiatorComponents };
