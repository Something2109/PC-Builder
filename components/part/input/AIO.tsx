import {
  TableWrapper,
  TableRowWrapper,
  InputRow,
  SelectInputRow,
} from "../TableWrapper";
import AIO from "@/utils/interface/part/AIO";
import { FormFactor, Material } from "@/utils/interface/utils";
import { FunctionComponent, TableHTMLAttributes } from "react";

const Components: {
  [key in keyof AIO.Info]: FunctionComponent<{ value: AIO.Info[key] }>;
} = {
  form_factor: ({ value }) => (
    <SelectInputRow
      name="form_factor"
      label="Form Factor"
      options={FormFactor.Radiator.options}
      defaultValue={value}
    />
  ),
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
  radiator_width: ({ value }) => (
    <InputRow
      type="number"
      step="0.01"
      name="radiator_width"
      label="Radiator Width"
      defaultValue={value}
    />
  ),
  radiator_length: ({ value }) => (
    <InputRow
      type="number"
      step="0.01"
      name="radiator_length"
      label="Radiator Length"
      defaultValue={value}
    />
  ),
  radiator_height: ({ value }) => (
    <InputRow
      type="number"
      step="0.01"
      name="radiator_height"
      label="Radiator Height"
      defaultValue={value}
    />
  ),
  pump_width: ({ value }) => (
    <InputRow
      type="number"
      step="0.01"
      name="pump_width"
      label="Pump Width"
      defaultValue={value}
    />
  ),
  pump_length: ({ value }) => (
    <InputRow
      type="number"
      step="0.01"
      name="pump_length"
      label="Pump Length"
      defaultValue={value}
    />
  ),
  pump_height: ({ value }) => (
    <InputRow
      type="number"
      step="0.01"
      name="pump_height"
      label="Pump Height"
      defaultValue={value}
    />
  ),
  pump_speed: ({ value }) => (
    <InputRow
      type="number"
      step="0.01"
      name="pump_speed"
      label="Pump Speed"
      defaultValue={value}
    />
  ),
};

export default function AIOFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<AIO.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      {Object.entries(defaultValue ?? {}).map(([key, value]) => {
        const Component = Components[key as keyof AIO.Info];

        if (!value || !Component) return undefined;

        return Component(value as never);
      })}
    </TableWrapper>
  );
}
