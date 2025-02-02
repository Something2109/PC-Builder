import Radiator from "@/utils/interface/part/Radiator";
import { FormFactor, Material } from "@/utils/interface/utils";
import { InputRow, SelectInputRow, GenericTable } from "../TableWrapper";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof Radiator.Info]: FunctionComponent<{
    value: Radiator.Info[key];
  }>;
} = {
  form_factor: ({ value }) => (
    <SelectInputRow
      name="form_factor"
      label="Form Factor"
      options={FormFactor.Pump.options}
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
  fpi: ({ value }) => (
    <InputRow type="number" name="fpi" label="FPI" defaultValue={value} />
  ),
  material: ({ value }) => (
    <SelectInputRow
      name="material"
      label="Material"
      options={Material.Metal.options}
      defaultValue={value}
    />
  ),
};

export default GenericTable(Components);
