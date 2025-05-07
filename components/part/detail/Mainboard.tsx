import { SuffixDisplay } from "@/components/utils/Display";
import { Table, InfoComponent, InfoComponentObject } from "../utils/Table";
import Mainboard from "@/utils/interface/part/info/Mainboard";
import { InternalConnectors } from "@/utils/interface/utils";

const Components: InfoComponentObject<Mainboard.Info> = {
  form_factor: ({ defaultValue: value }) => value,
  socket: ({ defaultValue: value }) => value,
  chipset: ({ defaultValue: value }) => value,
  ram_form_factor: ({ defaultValue: value }) => value,
  ram_interface: ({ defaultValue: value }) => value,
  ram_slot: ({ defaultValue: value }) => (
    <SuffixDisplay suffix="slot(s)">{value}</SuffixDisplay>
  ),
  pcies: ({ defaultValue: value }) => <PCIeTableRow defaultValue={value} />,
  power_connectors: ({ defaultValue: value }) =>
    Object.entries(value ?? {})
      .map(([key, count]) => `${count} * ${key}`)
      .join(", "),
  fan_connectors: ({ defaultValue: value }) =>
    Object.entries(value ?? {})
      .map(([key, count]) => `${count} * ${key}`)
      .join(", "),
  storage_connectors: ({ defaultValue: value }) =>
    Object.entries(value ?? {})
      .map(([key, count]) => `${count} * ${key}`)
      .join(", "),
  usb_connectors: ({ defaultValue: value }) =>
    Object.entries(value ?? {})
      .map(([key, count]) => `${count} * ${key}`)
      .join(", "),
  miscelanous_connectors: ({ defaultValue: value }) =>
    Object.entries(value ?? {})
      .map(([key, count]) => `${count} * ${key}`)
      .join(", "),
  back_panel_ports: ({ defaultValue: value }) =>
    Object.entries(value ?? {})
      .map(([key, count]) => `${count} * ${key}`)
      .join(", "),
};

const PCIeControllerName: {
  [key in InternalConnectors.PCIe.Controller]: string;
} = {
  cpu: "CPU",
  chipset: "Chipset",
};

function PCIeTableRow({ defaultValue }: { defaultValue?: Mainboard.PCIe }) {
  if (!defaultValue) return undefined;

  return (
    <table className="w-full">
      <tbody>
        {Object.entries(PCIeControllerName).map(([key, label], index, arr) => {
          const value = defaultValue[key as InternalConnectors.PCIe.Controller];
          if (!value) return undefined;

          const tableValues = Object.entries(value)
            .map(([key, value]) => `${value} * ${key}`)
            .join(", ");

          return (
            <Table.Row key={new Date().getTime() + index}>
              <Table.Cell className="font-bold">{label}</Table.Cell>
              <Table.Cell>{tableValues}</Table.Cell>
            </Table.Row>
          );
        })}
      </tbody>
    </table>
  );
}

export default InfoComponent(Components, Mainboard.Label, { strict: true });
