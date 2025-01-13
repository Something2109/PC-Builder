import CPUBlock from "@/utils/interface/part/CPUBlock";
import { InternalConnectors, Material } from "@/utils/interface/utils";
import { TableWrapper, InputRow, SelectInputRow } from "../TableWrapper";
import { TableHTMLAttributes } from "react";

export default function CPUBlockTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<CPUBlock.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <InputRow
        name="socket"
        label="Socket"
        defaultValue={defaultValue?.socket}
      />
      <SelectInputRow
        name="plate"
        label="Plate"
        options={Material.Metal.options}
        defaultValue={defaultValue?.plate}
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
