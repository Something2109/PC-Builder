import { Table } from "../utils/Table";
import * as CaseMainboardSupport from "@/utils/part/info/CaseMainboardSupport";

export default ({
  defaultValue,
}: {
  defaultValue: CaseMainboardSupport.DTO[];
}) => (
  <Table.Component>
    <Table.Head>
      <Table.Row>
        <Table.Cell>{CaseMainboardSupport.Label.form_factor}</Table.Cell>
      </Table.Row>
    </Table.Head>
    <tbody>
      <Table.Row>
        <Table.Cell>
          {defaultValue.map((val) => val.form_factor).join(", ")}
        </Table.Cell>
      </Table.Row>
    </tbody>
  </Table.Component>
);
