import Radiator from "@/utils/interface/part/Radiator";
import { FormFactor, Material } from "@/utils/interface/utils";
import {
  TableWrapper,
  InputRow,
  SelectInputRow,
  DimensionInputRow,
} from "../TableWrapper";
import { FunctionComponent, TableHTMLAttributes } from "react";

const Components: {
  [key in keyof Radiator.Info]: FunctionComponent<{
    value: Radiator.Info[key];
  }>;
} = {
  form_factor: ({ value }) => (
    <SelectInputRow
      name="form_factor"
      label="Form Factor"
      options={FormFactor.Pump.options}
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
  fpi: ({ value }) => (
    <InputRow type="number" name="fpi" label="FPI" defaultValue={value} />
  ),
  material: ({ value }) => (
    <SelectInputRow
      name="material"
      label="Material"
      options={Material.Metal.options}
      defaultValue={value}
    />
  ),
};

export default function RadiatorTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<Radiator.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      {Object.entries(defaultValue ?? {}).map(([key, value]) => {
        const Component = Components[key as keyof Radiator.Info];

        if (!value || !Component) return undefined;

        return Component(value as never);
      })}
    </TableWrapper>
  );
}
