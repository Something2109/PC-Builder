import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { Input, OptionSelect } from "@/components/utils/Input";
import Mainboard from "@/utils/interface/info/Mainboard";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";

const Components: InfoInputMapping<Mainboard.Info> = {
  form_factor: (props) => (
    <OptionSelect options={FormFactor.Mainboard.options} {...props} />
  ),
  socket: (props) => <Input {...props} />,
  chipset: (props) => <Input {...props} />,
  ram_form_factor: (props) => (
    <OptionSelect options={FormFactor.RAM.options} {...props} />
  ),
  ram_interface: (props) => (
    <OptionSelect options={InternalConnectors.RAM.options} {...props} />
  ),
  ram_slot: (props) => <Input type="number" {...props} />,
  expansion_slots: (props) => <Input type="number" {...props} />,
  pcies: (props) => <></>,
  power_connectors: (props) => <></>,
  fan_connectors: (props) => <></>,
  storage_connectors: (props) => <></>,
  usb_connectors: (props) => <></>,
  miscelanous_connectors: (props) => <></>,
  back_panel_ports: (props) => <></>,
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return Mainboard.Schema.partial().parse(raw);
}

export default GenericInputTable(Components, Mainboard.Label, submit);
