import { InfoComponentObject } from "../utils/Table";
import { GenericDetailTable } from "../TableWrapper";
import { UnitDisplay } from "@/components/utils/Display";
import Cooler from "@/utils/interface/part/info/Cooler";
import { LengthUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<Cooler.Info> = {
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
