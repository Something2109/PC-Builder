import * as CaseHardDriveSupport from "@pc-builder/shared/part/info/CaseHardDriveSupport";

import { Table } from "../utils/Table";

const CaseHardDriveSupportDisplay = ({
  defaultValue,
}: {
  defaultValue: CaseHardDriveSupport.DTO[];
}) => {
  const value = Object.groupBy(defaultValue, (val) => val.place);

  return (
    <Table.Component>
      <Table.Head>
        <Table.Row>
          <Table.Cell>{CaseHardDriveSupport.Label.place}</Table.Cell>
          <Table.Cell>{CaseHardDriveSupport.Label.form_factor}</Table.Cell>
          <Table.Cell>{CaseHardDriveSupport.Label.count}</Table.Cell>
        </Table.Row>
      </Table.Head>
      <tbody>
        {Object.entries(value).map(([side, fanObj]) =>
          fanObj.map(({ form_factor, count }, index, fans) => (
            <Table.Row key={`drive-${side}-${form_factor}`}>
              {index === 0 && (
                <Table.Cell className="font-bold" rowSpan={fans.length}>
                  {side}
                </Table.Cell>
              )}
              <Table.Cell>{form_factor}</Table.Cell>
              <Table.Cell>{count}</Table.Cell>
            </Table.Row>
          ))
        )}
      </tbody>
    </Table.Component>
  );
};

export default CaseHardDriveSupportDisplay;
