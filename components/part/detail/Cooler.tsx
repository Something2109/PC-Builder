import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { UnitDisplay } from "@/components/utils/Display";
import Cooler from "@/utils/interface/part/info/Cooler";
import { LengthUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<Cooler.Info> = {
  socket: ({ defaultValue: value }) => value,
  cpu_plate: ({ defaultValue: value }) => value,
  width: ({ defaultValue: value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  length: ({ defaultValue: value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  height: ({ defaultValue: value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
};

export default InfoComponent(Components, Cooler.Label, { strict: true });
