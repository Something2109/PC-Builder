import { Table } from "../utils/Table";
import CaseHardDriveSupport from "@/utils/interface/part/info/CaseHardDriveSupport";
import { Case } from "@/utils/interface/utils";

type CaseSideHardDriveObject = {
  [side in Case.HardDrivePlace]?: {
    [form in Case.HardDriveFormFactor]?: number;
  };
};

export default function CaseHardDriveSupportDisplay({
  defaultValue,
}: {
  defaultValue: CaseHardDriveSupport.Info[];
}) {
  const value: CaseSideHardDriveObject =
    defaultValue.reduce<CaseSideHardDriveObject>(
      (acc: CaseSideHardDriveObject, curr: CaseHardDriveSupport.Info) => {
        const side = curr.place;
        if (!acc[side]) acc[side] = {};

        acc[side][curr.form_factor] = curr.count;

        return acc;
      },
      {}
    );

  return (
    <Table.Component>
      <thead>
        <Table.Row>
          <Table.Cell>{CaseHardDriveSupport.Label.place}</Table.Cell>
          <Table.Cell>{CaseHardDriveSupport.Label.form_factor}</Table.Cell>
          <Table.Cell>{CaseHardDriveSupport.Label.count}</Table.Cell>
        </Table.Row>
      </thead>
      <tbody>
        {Object.entries(value).map(([side, fanObj]) =>
          Object.entries(fanObj).map(([form, count], index, fans) => (
            <Table.Row key={`drive-${side}-${form}`}>
              {index === 0 && (
                <Table.Cell rowSpan={fans.length}>{side}</Table.Cell>
              )}
              <Table.Cell>{form}</Table.Cell>
              <Table.Cell>{count}</Table.Cell>
            </Table.Row>
          ))
        )}
      </tbody>
    </Table.Component>
  );
}
