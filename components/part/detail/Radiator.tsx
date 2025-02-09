import { UnitDisplay } from "@/components/utils/Display";
import { LengthUnits } from "@/utils/extract/Units";
import Radiator from "@/utils/interface/info/Radiator";
import { GenericDetailTable } from "../TableWrapper";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof Radiator.Info]: FunctionComponent<{
    value: Radiator.Info[key];
  }>;
} = {
  form_factor: ({ value }) => value,
  width: ({ value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  length: ({ value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  height: ({ value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  fpi: ({ value }) => value,
  material: ({ value }) => value,
};

export default GenericDetailTable(Components, Radiator.Label);
