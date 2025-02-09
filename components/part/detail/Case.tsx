import { Table, GenericDetailTable, InfoDetailMapping } from "../TableWrapper";
import { UnitDisplay } from "@/components/utils/Display";
import Case from "@/utils/interface/info/Case";
import { LengthUnits } from "@/utils/extract/Units";

const Components: InfoDetailMapping<Case.Info> = {
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
  mainboard_support: ({ value }) => value?.join(", "),
  expansion_slot: ({ value }) => value,
  max_cooler_height: ({ value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  radiator_support: ({ value }) => (
    <CaseSideTableRow label={"Radiator Support"} defaultValue={value} />
  ),
  fan_support: ({ value }) => (
    <CaseSideTableRow label={"Fan Support"} defaultValue={value} />
  ),
  hard_drive_support: ({ value }) => (
    <CaseSideTableRow label={"Hard Drive Support"} defaultValue={value} />
  ),
  psu_support: ({ value }) => value?.join(", "),
  max_psu_length: ({ value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  front_panel_ports: ({ value }) =>
    Object.entries(value ?? {})
      .map(([key, count]) => `${count} * ${key}`)
      .join(", "),
};

export function CaseSideTableRow({
  label,
  defaultValue,
}: {
  label: string;
  defaultValue?: Case.FanSupport | Case.RadiatorSupport | Case.HardDriveSupport;
}) {
  if (!defaultValue) return undefined;

  return (
    <table className="w-full">
      <tbody>
        {Object.entries(defaultValue).map(([key, value], index, arr) => {
          const tableValues = Array.isArray({ value })
            ? value.join(", ")
            : Object.entries(value)
                .map(([key, value]) => `${value} * ${key}`)
                .join(", ");

          return (
            <Table.Row key={new Date().getTime() + index}>
              <Table.Cell className="font-bold">{key}</Table.Cell>
              <Table.Cell>{tableValues}</Table.Cell>
            </Table.Row>
          );
        })}
      </tbody>
    </table>
  );
}

export default GenericDetailTable(Components, Case.Label);
