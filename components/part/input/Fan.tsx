import {
  TableWrapper,
  InputRow,
  SelectInputRow,
  DimensionInputRow,
} from "../TableWrapper";
import Fan from "@/utils/interface/part/Fan";
import { FormFactor } from "@/utils/interface/utils";
import { TableHTMLAttributes } from "react";

export default function FanFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<Fan.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <SelectInputRow
        name="form_factor"
        label="Form Factor"
        options={FormFactor.Fan.options}
        defaultValue={defaultValue?.form_factor}
      />
      <DimensionInputRow defaultValue={defaultValue} />
      <InputRow
        type="number"
        name="voltage"
        label="Voltage"
        defaultValue={defaultValue?.voltage}
      />
      <InputRow
        type="number"
        name="speed"
        label="Speed"
        defaultValue={defaultValue?.speed}
      />
      <InputRow
        type="number"
        name="airflow"
        label="Airflow"
        defaultValue={defaultValue?.airflow}
      />
      <InputRow
        type="number"
        name="noise"
        label="Noise"
        defaultValue={defaultValue?.noise}
      />
      <InputRow
        type="number"
        name="static_pressure"
        label="Static Pressure"
        defaultValue={defaultValue?.static_pressure}
      />
      <SelectInputRow
        name="bearing"
        label="Form Factor"
        options={Fan.Bearing.options}
        defaultValue={defaultValue?.bearing}
      />
    </TableWrapper>
  );
}
