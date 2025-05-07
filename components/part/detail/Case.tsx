import { Table, InfoComponent, InfoComponentObject } from "../utils/Table";
import { UnitDisplay } from "@/components/utils/Display";
import Case from "@/utils/interface/part/info/Case";
import { LengthUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<Case.Info> = {
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
  mainboard_support: ({ defaultValue: value }) => value?.join(", "),
  expansion_slot: ({ defaultValue: value }) => value,
  max_cooler_height: ({ defaultValue: value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  radiator_support: ({ defaultValue: value }) => (
    <CaseSideTableRow label={"Radiator Support"} defaultValue={value} />
  ),
  fan_support: ({ defaultValue: value }) => (
    <CaseSideTableRow label={"Fan Support"} defaultValue={value} />
  ),
  hard_drive_support: ({ defaultValue: value }) => (
    <CaseSideTableRow label={"Hard Drive Support"} defaultValue={value} />
  ),
  psu_support: ({ defaultValue: value }) => value?.join(", "),
  max_psu_length: ({ defaultValue: value }) => (
    <UnitDisplay Unit={LengthUnits} defaultUnit="mm" defaultValue={value} />
  ),
  front_panel_ports: ({ defaultValue: value }) =>
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
          const tableValues = Array.isArray({ defaultValue: value })
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

export default InfoComponent(Components, Case.Label, { strict: true });
