import {
  TableWrapper,
  TableRowWrapper,
  InputRow,
  SelectInputRow,
} from "../TableWrapper";
import AIO from "@/utils/interface/part/AIO";
import { AIOFormFactors, CoolerCPUPlates } from "@/utils/interface/utils";
import { TableHTMLAttributes } from "react";

export default function AIOFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<AIO.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <SelectInputRow
        name="form_factor"
        label="Form Factor"
        options={AIOFormFactors.options}
        defaultValue={defaultValue?.form_factor}
      />
      <InputRow
        name="socket"
        label="Socket"
        defaultValue={defaultValue?.socket}
      />
      <SelectInputRow
        name="cpu_plate"
        label="CPU Plate"
        options={CoolerCPUPlates.options}
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
    </TableWrapper>
  );
}
