import { DimensionInputRow, SelectInputRow, InputRow } from "./utils";
import Cooler from "@/utils/interface/part/Cooler";
import { CoolerCPUPlates } from "@/utils/interface/utils";
import { TableHTMLAttributes } from "react";

export function CoolerFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<Cooler.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <table className="w-full" {...rest}>
      <tbody>
        <InputRow
          name="socket"
          label="Socket"
          defaultValue={defaultValue?.socket}
        />
        <SelectInputRow
          name="cpu_plate"
          label="CPU Plate"
          options={CoolerCPUPlates}
          defaultValue={defaultValue?.cpu_plate}
        />
        <DimensionInputRow defaultValue={defaultValue} />
      </tbody>
    </table>
  );
}
