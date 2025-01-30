import { TableWrapper, InputRow, DimensionInputRow } from "../TableWrapper";
import GraphicCard from "@/utils/interface/part/GraphicCard";
import { FunctionComponent, TableHTMLAttributes } from "react";

const Components: {
  [key in keyof GraphicCard.Info]: FunctionComponent<{
    value: GraphicCard.Info[key];
  }>;
} = {
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
  base_frequency: ({ value }) => (
    <InputRow
      type="number"
      name="base_frequency"
      label="Base Frequency"
      defaultValue={value}
    />
  ),
  boost_frequency: ({ value }) => (
    <InputRow
      type="number"
      name="boost_frequency"
      label="Boost Frequency"
      defaultValue={value}
    />
  ),
  pcie: ({ value }) => (
    <InputRow
      type="number"
      name="pcie"
      label="PCIe Version"
      defaultValue={value}
    />
  ),
  minimum_psu: ({ value }) => (
    <InputRow
      type="number"
      name="minimum_psu"
      label="Minimum PSU Required"
      defaultValue={value}
    />
  ),
  power_connector: ({ value }) => <></>,
  port: ({ value }) => <></>,
  gpu: ({ value }) => <></>,
};

export default function GraphicCardFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<GraphicCard.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      {Object.entries(defaultValue ?? {}).map(([key, value]) => {
        const Component = Components[key as keyof GraphicCard.Info];

        if (!value || !Component) return undefined;

        return Component(value as never);
      })}
    </TableWrapper>
  );
}
