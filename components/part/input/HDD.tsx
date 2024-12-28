import { TableWrapper, InputRow, SelectInputRow } from "../TableWrapper";
import HDD from "@/utils/interface/part/HDD";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { TableHTMLAttributes } from "react";

export default function HDDFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<HDD.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
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
        options={FormFactor.HDD.options}
        defaultValue={defaultValue?.form_factor}
      />
      <SelectInputRow
        name="interface"
        label="Interface"
        options={InternalConnectors.Storage.HDD.options}
        defaultValue={defaultValue?.interface}
      />
      <InputRow name="features" label="Features" />
    </TableWrapper>
  );
}
