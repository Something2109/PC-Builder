import { SuffixDisplay } from "@/components/utils/Display";
import { Table, GenericDetailTable, InfoDetailMapping } from "../TableWrapper";
import Mainboard from "@/utils/interface/info/Mainboard";
import { InternalConnectors } from "@/utils/interface/utils";

const Components: InfoDetailMapping<Mainboard.Info> = {
  form_factor: ({ value }) => value,
  socket: ({ value }) => value,
  chipset: ({ value }) => value,
  ram_form_factor: ({ value }) => value,
  ram_interface: ({ value }) => value,
  ram_slot: ({ value }) => (
    <SuffixDisplay suffix="slot(s)">{value}</SuffixDisplay>
  ),
  pcies: ({ value }) => <PCIeTableRow defaultValue={value} />,
  power_connectors: ({ value }) =>
    Object.entries(value ?? {})
      .map(([key, count]) => `${count} * ${key}`)
      .join(", "),
  fan_connectors: ({ value }) =>
    Object.entries(value ?? {})
      .map(([key, count]) => `${count} * ${key}`)
      .join(", "),
  storage_connectors: ({ value }) =>
    Object.entries(value ?? {})
      .map(([key, count]) => `${count} * ${key}`)
      .join(", "),
  usb_connectors: ({ value }) =>
    Object.entries(value ?? {})
      .map(([key, count]) => `${count} * ${key}`)
      .join(", "),
  miscelanous_connectors: ({ value }) =>
    Object.entries(value ?? {})
      .map(([key, count]) => `${count} * ${key}`)
      .join(", "),
  back_panel_ports: ({ value }) =>
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

export default GenericDetailTable(Components, Mainboard.Label);
