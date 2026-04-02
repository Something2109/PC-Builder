import { Table } from "../utils/Table";
import * as CaseFanSupport from "@/utils/part/info/CaseFanSupport";

export default function CaseFanSupportDisplay({
  defaultValue,
}: {
  defaultValue: CaseFanSupport.DTO[];
}) {
  const value = Object.groupBy(defaultValue, (val) => val.case_side);

  return (
    <Table.Component>
      <Table.Head>
        <Table.Row>
          <Table.Cell>{CaseFanSupport.Label.case_side}</Table.Cell>
          <Table.Cell>{CaseFanSupport.Label.form_factor}</Table.Cell>
          <Table.Cell>{CaseFanSupport.Label.count}</Table.Cell>
        </Table.Row>
      </Table.Head>
      <tbody>
        {Object.entries(value).map(([side, fanObj]) =>
          fanObj.map(({ form_factor, count }, index, fans) => (
            <Table.Row key={`fan-${side}-${form_factor}`}>
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
}
