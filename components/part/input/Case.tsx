import { InputRow, SelectInputRow, GenericTable } from "../TableWrapper";
import Case from "@/utils/interface/part/Case";
import { FormFactor } from "@/utils/interface/utils";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof Case.Info]: FunctionComponent<{ value: Case.Info[key] }>;
} = {
  form_factor: ({ value }) => (
    <SelectInputRow
      name="form_factor"
      label="Form Factor"
      options={FormFactor.Case.options}
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
  mainboard_support: ({ value }) => <></>,
  expansion_slot: ({ value }) => (
    <InputRow
      type="number"
      name="expansion_slot"
      label="Expansion Slot"
      defaultValue={value}
    />
  ),
  max_cooler_height: ({ value }) => (
    <InputRow
      type="number"
      name="max_cooler_height"
      label="Max Cooler Support"
      defaultValue={value}
    />
  ),
  radiator_support: ({ value }) => <></>,
  fan_support: ({ value }) => <></>,
  hard_drive_support: ({ value }) => <></>,
  psu_support: ({ value }) => <></>,
  max_psu_length: ({ value }) => (
    <InputRow
      type="number"
      name="max_psu_length"
      label="Max PSU Length"
      defaultValue={value}
    />
  ),
  front_panel_ports: function ({ value }): JSX.Element {
    throw new Error("Function not implemented.");
  },
};

export default GenericTable(Components);
