import { DimensionInputRow, SelectInputRow, InputRow } from "./utils";
import Case from "@/utils/interface/part/Case";
import {
  CaseFormFactors,
  MainboardFormFactors,
  PSUFormFactors,
} from "@/utils/interface/utils";
import { TableHTMLAttributes } from "react";

export function CaseFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<Case.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <table className="w-full" {...rest}>
      <tbody>
        <SelectInputRow
          name="form_factor"
          label="Form Factor"
          options={CaseFormFactors}
          defaultValue={defaultValue?.form_factor}
        />
        <DimensionInputRow defaultValue={defaultValue} />
        <InputRow name="io_ports" label="I/O Ports" />
        <SelectInputRow
          name="mb_support"
          label="Mainboard Support"
          options={MainboardFormFactors}
          defaultValue={defaultValue?.mb_support}
        />
        <InputRow
          type="number"
          name="expansion_slot"
          label="Expansion Slot"
          defaultValue={defaultValue?.expansion_slot}
        />
        <InputRow name="aio_support" label="AIO Support" />
        <InputRow name="fan_support" label="Fan Support" />
        <InputRow
          type="number"
          name="max_cooler_height"
          label="Max Cooler Support"
          defaultValue={defaultValue?.max_cooler_height}
        />
        <SelectInputRow
          name="psu_support"
          label="PSU Support"
          options={PSUFormFactors}
          defaultValue={defaultValue?.psu_support}
        />
        <InputRow
          type="number"
          name="max_psu_length"
          label="Max PSU Length"
          defaultValue={defaultValue?.max_psu_length}
        />
      </tbody>
    </table>
  );
}
