import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import PSU from "@/utils/interface/part/info/PSU";
import { LengthUnits } from "@/utils/extract/Units";
import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<PSU.Info> = {
  wattage: ({ defaultValue: value }) => (
    <SuffixDisplay suffix="W">{value}</SuffixDisplay>
  ),
  efficiency: ({ defaultValue: value }) => value,
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
  modular: ({ defaultValue: value }) => value,
  atx_pin: ({ defaultValue: value }) => value,
  cpu_pin: ({ defaultValue: value }) => value,
  pcie_pin: ({ defaultValue: value }) => value,
  sata_pin: ({ defaultValue: value }) => value,
  peripheral_pin: ({ defaultValue: value }) => value,
};

export default InfoComponent(Components, PSU.Label, { strict: true });
