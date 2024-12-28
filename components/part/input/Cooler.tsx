import {
  TableWrapper,
  InputRow,
  SelectInputRow,
  DimensionInputRow,
} from "../TableWrapper";
import Cooler from "@/utils/interface/part/Cooler";
import { TableHTMLAttributes } from "react";

export default function CoolerFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<Cooler.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <InputRow
        name="socket"
        label="Socket"
        defaultValue={defaultValue?.socket}
      />
      <SelectInputRow
        name="cpu_plate"
        label="CPU Plate"
        options={Cooler.CPUPlate.options}
        defaultValue={defaultValue?.cpu_plate}
      />
      <DimensionInputRow defaultValue={defaultValue} />
    </TableWrapper>
  );
}
