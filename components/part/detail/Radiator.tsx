import { UnitDisplay } from "@/components/utils/Display";
import { LengthUnits } from "@/utils/extract/Units";
import Radiator from "@/utils/interface/part/info/Radiator";
import { InfoComponentObject } from "../utils/Table";
import { GenericDetailTable } from "../TableWrapper";

const Components: InfoComponentObject<Radiator.Info> = {
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
