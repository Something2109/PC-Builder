import Pump from "@/utils/interface/part/Pump";
import {
  TableWrapper,
  InputRow,
  SelectInputRow,
  DimensionInputRow,
} from "../TableWrapper";
import { TableHTMLAttributes } from "react";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";

export default function PumpTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<Pump.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <SelectInputRow
        name="form_factor"
        label="Form Factor"
        options={FormFactor.Pump.options}
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
        name="wattage"
        label="Wattage"
        defaultValue={defaultValue?.wattage}
      />
      <InputRow
        type="number"
        name="head_pressure"
        label="Head Pressure"
        defaultValue={defaultValue?.head_pressure}
      />
      <InputRow
        type="number"
        name="head_pressure"
        label="Flow Rate"
        defaultValue={defaultValue?.flow_rate}
      />
      <SelectInputRow
        name="power_connector"
        label="Power Connector"
        options={InternalConnectors.Power.Miscellanous.options}
        defaultValue={defaultValue?.power_connector}
      />
      <SelectInputRow
        name="control_connector"
        label="Control Connector"
        options={InternalConnectors.Fan.Connector.options}
        defaultValue={defaultValue?.control_connector}
      />
      <SelectInputRow
        name="rgb"
        label="RGB"
        options={InternalConnectors.RGB.options}
        defaultValue={defaultValue?.rgb}
      />
    </TableWrapper>
  );
}
