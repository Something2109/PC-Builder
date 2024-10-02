import RAM from "@/utils/interface/part/RAM";
import { RAMFormFactors, RAMProtocols } from "@/utils/interface/utils";
import { TableHTMLAttributes } from "react";
import { SelectInputRow, InputRow } from "./utils";

export function RAMFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<RAM.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <table className="w-full" {...rest}>
      <tbody>
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
          options={RAMFormFactors}
          defaultValue={defaultValue?.form_factor}
        />
        <SelectInputRow
          name="protocol"
          label="Protocol"
          options={RAMProtocols}
          defaultValue={defaultValue?.protocol}
        />
      </tbody>
    </table>
  );
}
