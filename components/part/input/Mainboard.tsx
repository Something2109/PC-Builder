import { InputRow, SelectInputRow, GenericTable } from "../TableWrapper";
import Mainboard from "@/utils/interface/part/Mainboard";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof Mainboard.Info]: FunctionComponent<{
    value: Mainboard.Info[key];
  }>;
} = {
  form_factor: ({ value }) => (
    <SelectInputRow
      name="form_factor"
      label="Form Factor"
      options={FormFactor.Fan.options}
      defaultValue={value}
    />
  ),
  socket: ({ value }) => (
    <InputRow name="socket" label="Socket" defaultValue={value} />
  ),
  chipset: ({ value }) => (
    <InputRow name="chipset" label="Chipset" defaultValue={value} />
  ),
  ram_form_factor: ({ value }) => (
    <SelectInputRow
      name="ram_form_factor"
      label="RAM Form Factor"
      options={FormFactor.RAM.options}
      defaultValue={value}
    />
  ),
  ram_interface: ({ value }) => (
    <SelectInputRow
      name="ram_interface"
      label="RAM Interface"
      options={InternalConnectors.RAM.options}
      defaultValue={value}
    />
  ),
  ram_slot: ({ value }) => (
    <InputRow
      type="number"
      name="ram_slot"
      label="RAM Slot"
      defaultValue={value}
    />
  ),
  expansion_slots: ({ value }) => (
    <InputRow
      type="number"
      name="expansion_slots"
      label="Expansion Slots"
      defaultValue={value}
    />
  ),
  pcies: ({ value }) => <></>,
  power_connectors: ({ value }) => <></>,
  fan_connectors: ({ value }) => <></>,
  storage_connectors: ({ value }) => <></>,
  usb_connectors: ({ value }) => <></>,
  miscelanous_connectors: ({ value }) => <></>,
  back_panel_ports: ({ value }) => <></>,
};

export default GenericTable(Components);
