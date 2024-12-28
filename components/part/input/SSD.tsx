import { TableWrapper, InputRow, SelectInputRow } from "../TableWrapper";
import SSD from "@/utils/interface/part/SSD";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { TableHTMLAttributes } from "react";

export default function SSDFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<SSD.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <SelectInputRow
        name="memory_type"
        label="Memory Type"
        defaultValue={defaultValue?.memory_type}
        options={SSD.MemoryCell.options}
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
        options={FormFactor.SSD.options}
        defaultValue={defaultValue?.form_factor}
      />
      <SelectInputRow
        name="interface"
        label="Interface"
        options={InternalConnectors.Storage.SSD.options}
        defaultValue={defaultValue?.interface}
      />
    </TableWrapper>
  );
}
