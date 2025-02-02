import { GenericInputTable } from "../TableWrapper";
import { Input, OptionSelect } from "@/components/utils/Input";
import Mainboard from "@/utils/interface/part/Mainboard";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof Mainboard.Info]: FunctionComponent<{
    value?: Mainboard.Info[key];
  }>;
} = {
  form_factor: ({ value }) => (
    <OptionSelect
      name="form_factor"
      options={FormFactor.Fan.options}
      defaultValue={value}
    />
  ),
  socket: ({ value }) => <Input name="socket" defaultValue={value} />,
  chipset: ({ value }) => <Input name="chipset" defaultValue={value} />,
  ram_form_factor: ({ value }) => (
    <OptionSelect
      name="ram_form_factor"
      options={FormFactor.RAM.options}
      defaultValue={value}
    />
  ),
  ram_interface: ({ value }) => (
    <OptionSelect
      name="ram_interface"
      options={InternalConnectors.RAM.options}
      defaultValue={value}
    />
  ),
  ram_slot: ({ value }) => (
    <Input type="number" name="ram_slot" defaultValue={value} />
  ),
  expansion_slots: ({ value }) => (
    <Input type="number" name="expansion_slots" defaultValue={value} />
  ),
  pcies: ({ value }) => <></>,
  power_connectors: ({ value }) => <></>,
  fan_connectors: ({ value }) => <></>,
  storage_connectors: ({ value }) => <></>,
  usb_connectors: ({ value }) => <></>,
  miscelanous_connectors: ({ value }) => <></>,
  back_panel_ports: ({ value }) => <></>,
};

export default GenericInputTable(Components, Mainboard.Label);
