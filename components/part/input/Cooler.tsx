import {
  TableWrapper,
  InputRow,
  SelectInputRow,
  DimensionInputRow,
} from "../TableWrapper";
import Cooler from "@/utils/interface/part/Cooler";
import { Material } from "@/utils/interface/utils";
import { FunctionComponent, TableHTMLAttributes } from "react";

const Components: {
  [key in keyof Cooler.Info]: FunctionComponent<{ value: Cooler.Info[key] }>;
} = {
  socket: ({ value }) => (
    <InputRow name="socket" label="Socket" defaultValue={value} />
  ),
  cpu_plate: ({ value }) => (
    <SelectInputRow
      name="cpu_plate"
      label="CPU Plate"
      options={Material.Metal.options}
      defaultValue={value}
    />
  ),
  width: ({ value }) => (
    <InputRow
      type="number"
      step="0.01"
      name="width"
      label="Width"
      defaultValue={value}
    />
  ),
  length: ({ value }) => (
    <InputRow
      type="number"
      step="0.01"
      name="length"
      label="Length"
      defaultValue={value}
    />
  ),
  height: ({ value }) => (
    <InputRow
      type="number"
      step="0.01"
      name="height"
      label="Height"
      defaultValue={value}
    />
  ),
};

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
        options={Material.Metal.options}
        defaultValue={defaultValue?.cpu_plate}
      />
      <DimensionInputRow defaultValue={defaultValue} />
    </TableWrapper>
  );
}
