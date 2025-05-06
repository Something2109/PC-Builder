import { InfoComponentObject } from "../utils/Table";
import { GenericInputTable } from "../TableWrapper";
import { Input, SuffixInput, OptionSelect } from "@/components/utils/Input";
import Part from "@/utils/interface/part";
import Mainboard from "@/utils/interface/part/info/Mainboard";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { Infos } from "@/utils/Enum";

const Schema = Part.Detail.shape[Infos.MAIN];

const Components: InfoComponentObject<Mainboard.Info> = {
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
  ram_slot: (props) => (
    <SuffixInput suffix="slot(s)" type="number" {...props} />
  ),
  pcies: (props) => <></>,
  power_connectors: (props) => <></>,
  fan_connectors: (props) => <></>,
  storage_connectors: (props) => <></>,
  usb_connectors: (props) => <></>,
  miscelanous_connectors: (props) => <></>,
  back_panel_ports: (props) => <></>,
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(
    formData
      .entries()
      .map(([key, value]) => [
        key,
        value === "" || Number(value) === 0 ? undefined : value,
      ])
  ) as Record<string, string | string[]>;

  return Schema.parse(raw)!;
}

export default GenericInputTable(Components, Mainboard.Label, submit);
