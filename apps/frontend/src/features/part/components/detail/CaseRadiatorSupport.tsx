import { Case, FormFactor } from "@/utils/interface";
import * as CaseRadiatorSupport from "@/utils/part/info/CaseRadiatorSupport";

import { Table } from "../utils/Table";

type CaseSideRadiatorObject = { [side in Case.Side]?: FormFactor.Radiator[] };

export default function CaseRadiatorSupportDisplay({
  defaultValue,
}: {
  defaultValue: CaseRadiatorSupport.DTO[];
}) {
  const value: CaseSideRadiatorObject =
    defaultValue.reduce<CaseSideRadiatorObject>(
      (acc: CaseSideRadiatorObject, curr: CaseRadiatorSupport.Info) => {
        const side = curr.case_side;
        if (!acc[side]) acc[side] = [];

        acc[side].push(curr.form_factor);

        return acc;
      },
      {}
    );

  return (
    <Table.Component>
      <Table.Head>
        <Table.Row>
          <Table.Cell>{CaseRadiatorSupport.Label.case_side}</Table.Cell>
          <Table.Cell>{CaseRadiatorSupport.Label.form_factor}</Table.Cell>
        </Table.Row>
      </Table.Head>
      <tbody>
        {Object.entries(value).map(([side, radiatorObj]) => (
          <Table.Row key={`rad-${side}`}>
            <Table.Cell>{side}</Table.Cell>
            <Table.Cell>{radiatorObj.join(", ")}</Table.Cell>
          </Table.Row>
        ))}
      </tbody>
    </Table.Component>
  );
}
