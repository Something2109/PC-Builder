import { TableRowWrapper, GenericTable } from "../TableWrapper";
import Fan from "@/utils/interface/part/Fan";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof Fan.Info]: FunctionComponent<{ value: Fan.Info[key] }>;
} = {
  form_factor: ({ value }) => (
    <TableRowWrapper>Form Factor {value}</TableRowWrapper>
  ),
  width: ({ value }) => <TableRowWrapper>Width {value}</TableRowWrapper>,
  length: ({ value }) => <TableRowWrapper>Length {value}</TableRowWrapper>,
  height: ({ value }) => <TableRowWrapper>Height {value}</TableRowWrapper>,
  count: ({ value }) => <TableRowWrapper>Count {value}</TableRowWrapper>,
  voltage: ({ value }) => <TableRowWrapper>Voltage {value}</TableRowWrapper>,
  speed: ({ value }) => <TableRowWrapper>Speed {value}</TableRowWrapper>,
  airflow: ({ value }) => <TableRowWrapper>Airflow {value}</TableRowWrapper>,
  noise: ({ value }) => <TableRowWrapper>Noise {value}</TableRowWrapper>,
  static_pressure: ({ value }) => (
    <TableRowWrapper>Static Pressure {value}</TableRowWrapper>
  ),
  bearing: ({ value }) => <TableRowWrapper>Bearing {value}</TableRowWrapper>,
  connector: ({ value }) => (
    <TableRowWrapper>Power Connector {value}</TableRowWrapper>
  ),
  rgb: ({ value }) => <TableRowWrapper>RGB Connector {value}</TableRowWrapper>,
};

export default GenericTable(Components);
