import { GenericDetailTable } from "../TableWrapper";
import { UnitDisplay } from "@/components/utils/Display";
import Cooler from "@/utils/interface/info/Cooler";
import { LengthUnits } from "@/utils/extract/Units";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof Cooler.Info]: FunctionComponent<{ value: Cooler.Info[key] }>;
} = {
  socket: ({ value }) => value,
  cpu_plate: ({ value }) => value,
  width: ({ value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  length: ({ value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  height: ({ value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
};

export default GenericDetailTable(Components, Cooler.Label);
