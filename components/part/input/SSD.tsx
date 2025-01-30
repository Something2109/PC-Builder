import { TableWrapper, InputRow, SelectInputRow } from "../TableWrapper";
import SSD from "@/utils/interface/part/SSD";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { FunctionComponent, TableHTMLAttributes } from "react";

const Components: {
  [key in keyof SSD.Info]: FunctionComponent<{ value: SSD.Info[key] }>;
} = {
  memory_type: ({ value }) => (
    <SelectInputRow
      name="memory_type"
      label="Memory Type"
      options={SSD.MemoryCell.options}
      defaultValue={value}
    />
  ),
  read_speed: ({ value }) => (
    <InputRow
      type="number"
      name="read_speed"
      label="Read Speed"
      defaultValue={value}
    />
  ),
  write_speed: ({ value }) => (
    <InputRow
      type="number"
      name="write_speed"
      label="Write Speed"
      defaultValue={value}
    />
  ),
  capacity: ({ value }) => (
    <InputRow
      type="number"
      name="capacity"
      label="Capacity"
      defaultValue={value}
    />
  ),
  cache: ({ value }) => (
    <InputRow type="number" name="cache" label="Cache" defaultValue={value} />
  ),
  tbw: ({ value }) => (
    <InputRow type="number" name="tbw" label="TBW" defaultValue={value} />
  ),
  form_factor: ({ value }) => (
    <SelectInputRow
      name="form_factor"
      label="Form Factor"
      options={FormFactor.SSD.options}
      defaultValue={value}
    />
  ),
  interface: ({ value }) => (
    <SelectInputRow
      name="interface"
      label="Interface"
      options={InternalConnectors.Storage.SSD.options}
      defaultValue={value}
    />
  ),
};

export default function SSDFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<SSD.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      {Object.entries(defaultValue ?? {}).map(([key, value]) => {
        const Component = Components[key as keyof SSD.Info];

        if (!value || !Component) return undefined;

        return Component(value as never);
      })}
    </TableWrapper>
  );
}
