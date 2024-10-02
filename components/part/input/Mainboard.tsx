import { SelectInputRow, InputRow } from "./utils";
import Mainboard from "@/utils/interface/part/Mainboard";
import {
  MainboardFormFactors,
  RAMFormFactors,
  RAMProtocols,
} from "@/utils/interface/utils";
import { TableHTMLAttributes } from "react";

export function MainboardFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<Mainboard.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <table className="w-full" {...rest}>
      <tbody>
        <SelectInputRow
          name="form_factor"
          label="Form Factor"
          options={MainboardFormFactors}
          defaultValue={defaultValue?.form_factor}
        />
        <InputRow
          name="socket"
          label="Socket"
          defaultValue={defaultValue?.socket}
        />
        <SelectInputRow
          name="ram_form_factor"
          label="RAM Form Factor"
          options={RAMFormFactors}
          defaultValue={defaultValue?.ram_form_factor}
        />
        <SelectInputRow
          name="ram_protocol"
          label="RAM Protocol"
          options={RAMProtocols}
          defaultValue={defaultValue?.ram_protocol}
        />
        <InputRow
          type="number"
          name="ram_slot"
          label="RAM Slot"
          defaultValue={defaultValue?.ram_slot}
        />
        <InputRow
          type="number"
          name="expansion_slots"
          label="Expansion Slots"
          defaultValue={defaultValue?.expansion_slots}
        />
        <InputRow name="io_ports" label="I/O Ports" />
      </tbody>
    </table>
  );
}
