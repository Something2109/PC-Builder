import { Products } from "@/utils/Enum";
import { SelectInputRow, InputRow, TableRowWrapper } from "./utils";
import AIO from "@/utils/interface/part/AIO";
import { AIOFormFactors, CoolerCPUPlates } from "@/utils/interface/utils";
import { TableHTMLAttributes } from "react";

export function AIOFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<AIO.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <table className="w-full" {...rest}>
      <tbody>
        <SelectInputRow
          name={`${Products.AIO}.form_factor`}
          label="Form Factor"
          options={AIOFormFactors}
          defaultValue={defaultValue?.form_factor}
        />
        <InputRow
          name={`${Products.AIO}.socket`}
          label="Socket"
          defaultValue={defaultValue?.socket}
        />
        <SelectInputRow
          name={`${Products.AIO}.cpu_plate`}
          label="CPU Plate"
          options={CoolerCPUPlates}
          defaultValue={defaultValue?.cpu_plate}
        />
        <TableRowWrapper>
          Radiator
          <table className="w-full">
            <tbody>
              <InputRow
                type="number"
                name="radiator_width"
                label="Width"
                defaultValue={defaultValue?.radiator_width}
              />
              <InputRow
                type="number"
                name="radiator_length"
                label="Length"
                defaultValue={defaultValue?.radiator_length}
              />
              <InputRow
                type="number"
                name="radiator_height"
                label="Height"
                defaultValue={defaultValue?.radiator_height}
              />
            </tbody>
          </table>
        </TableRowWrapper>
        <TableRowWrapper>
          Pump
          <table className="w-full">
            <tbody>
              <InputRow
                type="number"
                name="pump_width"
                label="Width"
                defaultValue={defaultValue?.pump_width}
              />
              <InputRow
                type="number"
                name="pump_length"
                label="Length"
                defaultValue={defaultValue?.pump_length}
              />
              <InputRow
                type="number"
                name="pump_height"
                label="Height"
                defaultValue={defaultValue?.pump_height}
              />
            </tbody>
          </table>
        </TableRowWrapper>
      </tbody>
    </table>
  );
}
