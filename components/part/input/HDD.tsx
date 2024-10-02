import { SelectInputRow, InputRow } from "./utils";
import HDD from "@/utils/interface/part/HDD";
import { HDDFormFactors, HDDProtocols } from "@/utils/interface/utils";
import { TableHTMLAttributes } from "react";

export function HDDFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<HDD.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <table className="w-full" {...rest}>
      <tbody>
        <InputRow
          type="number"
          name="rotational_speed"
          label="Rotational Speed"
          defaultValue={defaultValue?.rotational_speed}
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
        <SelectInputRow
          name="form_factor"
          label="Form Factor"
          options={HDDFormFactors}
          defaultValue={defaultValue?.form_factor}
        />
        <SelectInputRow
          name="protocol"
          label="Protocol"
          options={HDDProtocols}
          defaultValue={defaultValue?.protocol}
        />
        <InputRow
          type="number"
          name="protocol_version"
          label="Protocol Version"
          defaultValue={defaultValue?.protocol_version}
        />
        <InputRow name="features" label="Features" />
      </tbody>
    </table>
  );
}
