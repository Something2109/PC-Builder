import { UnitDisplay } from "@/components/utils/Display";
import { LengthUnits } from "@/utils/extract/Units";
import Radiator from "@/utils/interface/part/info/Radiator";
import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<Radiator.Info> = {
  form_factor: ({ defaultValue: value }) => value,
  width: ({ defaultValue: value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  length: ({ defaultValue: value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  height: ({ defaultValue: value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  fpi: ({ defaultValue: value }) => value,
  material: ({ defaultValue: value }) => value,
};

export default InfoComponent(Components, Radiator.Label, { strict: true });
