import { GenericInputTable } from "../TableWrapper";
import { Input, OptionSelect } from "@/components/utils/Input";
import Case from "@/utils/interface/part/Case";
import { FormFactor } from "@/utils/interface/utils";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof Case.Info]: FunctionComponent<{ value?: Case.Info[key] }>;
} = {
  form_factor: ({ value }) => (
    <OptionSelect
      name="form_factor"
      options={FormFactor.Case.options}
      defaultValue={value}
    />
  ),
  width: ({ value }) => (
    <Input type="number" step="0.01" name="width" defaultValue={value} />
  ),
  length: ({ value }) => (
    <Input type="number" step="0.01" name="length" defaultValue={value} />
  ),
  height: ({ value }) => (
    <Input type="number" step="0.01" name="height" defaultValue={value} />
  ),
  mainboard_support: ({ value }) => <></>,
  expansion_slot: ({ value }) => (
    <Input type="number" name="expansion_slot" defaultValue={value} />
  ),
  max_cooler_height: ({ value }) => (
    <Input type="number" name="max_cooler_height" defaultValue={value} />
  ),
  radiator_support: ({ value }) => <></>,
  fan_support: ({ value }) => <></>,
  hard_drive_support: ({ value }) => <></>,
  psu_support: ({ value }) => <></>,
  max_psu_length: ({ value }) => (
    <Input type="number" name="max_psu_length" defaultValue={value} />
  ),
  front_panel_ports: ({ value }) => <></>,
};

export default GenericInputTable(Components, Case.Label);
