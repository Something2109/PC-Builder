import { GenericDetailTable, InfoDetailMapping } from "../TableWrapper";
import { UnitDisplay } from "@/components/utils/Display";
import Cooler from "@/utils/interface/info/Cooler";
import { LengthUnits } from "@/utils/extract/Units";

const Components: InfoDetailMapping<Cooler.Info> = {
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
