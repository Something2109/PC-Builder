import { DimensionInputRow, InputRow } from "./utils";
import GraphicCard from "@/utils/interface/part/GraphicCard";
import { TableHTMLAttributes } from "react";

export function GraphicCardFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<GraphicCard.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <table className="w-full" {...rest}>
      <tbody>
        <DimensionInputRow defaultValue={defaultValue} />
        <InputRow
          type="number"
          name="base_frequency"
          label="Base Frequency"
          defaultValue={defaultValue?.base_frequency}
        />
        <InputRow
          type="number"
          name="boost_frequency"
          label="Boost Frequency"
          defaultValue={defaultValue?.boost_frequency}
        />
        <InputRow
          type="number"
          name="pcie"
          label="PCIe Version"
          defaultValue={defaultValue?.pcie}
        />
        <InputRow
          type="number"
          name="minimum_psu"
          label="Minimun PSU Required"
          defaultValue={defaultValue?.minimum_psu}
        />
        <InputRow
          name="power_connector"
          label="Power Connector"
          defaultValue={defaultValue?.power_connector}
        />
      </tbody>
    </table>
  );
}
