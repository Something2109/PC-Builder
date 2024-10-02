import PSU from "@/utils/interface/part/PSU";
import {
  PSUEfficiencies,
  PSUFormFactors,
  PSUModulars,
} from "@/utils/interface/utils";
import { TableHTMLAttributes } from "react";
import { DimensionInputRow, InputRow, SelectInputRow } from "./utils";

export function PSUFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<PSU.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <table className="w-full" {...rest}>
      <tbody>
        <InputRow
          type="number"
          name="wattage"
          label="Wattage"
          defaultValue={defaultValue?.wattage}
        />
        <SelectInputRow
          name="efficiency"
          label="Efficiency"
          options={PSUEfficiencies}
          defaultValue={defaultValue?.efficiency}
        />
        <SelectInputRow
          name="form_factor"
          label="Form Factor"
          options={PSUFormFactors}
          defaultValue={defaultValue?.form_factor}
        />
        <DimensionInputRow defaultValue={defaultValue} />
        <SelectInputRow
          name="modular"
          label="Modular"
          options={PSUModulars}
          defaultValue={defaultValue?.modular}
        />
        <InputRow
          type="number"
          name="atx_pin"
          label="ATX Pin"
          defaultValue={defaultValue?.atx_pin}
        />
        <InputRow
          type="number"
          name="cpu_pin"
          label="CPU Pin"
          defaultValue={defaultValue?.cpu_pin}
        />
        <InputRow
          type="number"
          name="pcie_pin"
          label="PCIe Pin"
          defaultValue={defaultValue?.pcie_pin}
        />
        <InputRow
          type="number"
          name="sata_pin"
          label="SATA Pin"
          defaultValue={defaultValue?.sata_pin}
        />
        <InputRow
          type="number"
          name="peripheral_pin"
          label="Peripheral Pin"
          defaultValue={defaultValue?.peripheral_pin}
        />
      </tbody>
    </table>
  );
}
