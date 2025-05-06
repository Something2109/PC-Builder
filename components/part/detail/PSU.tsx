import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import PSU from "@/utils/interface/part/info/PSU";
import { LengthUnits } from "@/utils/extract/Units";
import { InfoComponentObject } from "../utils/Table";
import { GenericDetailTable } from "../TableWrapper";

const Components: InfoComponentObject<PSU.Info> = {
  wattage: ({ value }) => <SuffixDisplay suffix="W">{value}</SuffixDisplay>,
  efficiency: ({ value }) => value,
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
  modular: ({ value }) => value,
  atx_pin: ({ value }) => value,
  cpu_pin: ({ value }) => value,
  pcie_pin: ({ value }) => value,
  sata_pin: ({ value }) => value,
  peripheral_pin: ({ value }) => value,
};

export default GenericDetailTable(Components, PSU.Label);
