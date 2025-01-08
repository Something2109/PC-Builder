import { TableWrapper, InputRow, SelectInputRow } from "../TableWrapper";
import RAM from "@/utils/interface/part/RAM";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { TableHTMLAttributes } from "react";

export default function RAMFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<RAM.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <InputRow
        type="number"
        name="speed"
        label="Speed"
        defaultValue={defaultValue?.speed}
      />
      <InputRow
        type="number"
        name="capacity"
        label="Capacity"
        defaultValue={defaultValue?.capacity}
      />
      <InputRow
        type="number"
        name="voltage"
        label="Voltage"
        defaultValue={defaultValue?.voltage}
      />
      <InputRow type="number" name="latency" label="Latency" />
      <InputRow
        type="number"
        name="kit"
        label="RAM Kit"
        defaultValue={defaultValue?.kit}
      />
      <SelectInputRow
        name="form_factor"
        label="Form Factor"
        options={FormFactor.RAM.options}
        defaultValue={defaultValue?.form_factor}
      />
      <SelectInputRow
        name="interface"
        label="Interface"
        options={InternalConnectors.RAM.options}
        defaultValue={defaultValue?.interface}
      />
    </TableWrapper>
  );
}
