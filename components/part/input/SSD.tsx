import { SelectInputRow, InputRow } from "./utils";
import SSD from "@/utils/interface/part/SSD";
import {
  SSDFormFactors,
  SSDInterfaces,
  SSDProtocols,
} from "@/utils/interface/utils";
import { TableHTMLAttributes } from "react";

export function SSDFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<SSD.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <table className="w-full" {...rest}>
      <tbody>
        <InputRow
          name="memory_type"
          label="Rotational Speed"
          defaultValue={defaultValue?.memory_type}
        />
        <InputRow
          type="number"
          name="read_speed"
          label="Read Speed"
          defaultValue={defaultValue?.read_speed}
        />
        <InputRow
          type="number"
          name="write_speed"
          label="Write Speed"
          defaultValue={defaultValue?.write_speed}
        />
        <InputRow
          type="number"
          name="capacity"
          label="Capacity"
          defaultValue={defaultValue?.capacity}
        />
        <InputRow
          type="number"
          name="cache"
          label="Cache"
          defaultValue={defaultValue?.cache}
        />
        <InputRow
          type="number"
          name="tbw"
          label="TBW"
          defaultValue={defaultValue?.tbw}
        />
        <SelectInputRow
          name="form_factor"
          label="Form Factor"
          options={SSDFormFactors}
          defaultValue={defaultValue?.form_factor}
        />
        <SelectInputRow
          name="protocol"
          label="Protocol"
          options={SSDProtocols}
          defaultValue={defaultValue?.protocol}
        />
        <SelectInputRow
          name="interface"
          label="Interface"
          options={SSDInterfaces}
          defaultValue={defaultValue?.interface}
        />
      </tbody>
    </table>
  );
}
