import { Table } from "../utils/Table";
import CaseMainboardSupport from "@/utils/interface/part/info/CaseMainboardSupport";

export default ({
  defaultValue,
}: {
  defaultValue: CaseMainboardSupport.DTO[];
}) => (
  <Table.Component>
    <thead>
      <Table.Row>
        <Table.Cell>{CaseMainboardSupport.Label.form_factor}</Table.Cell>
      </Table.Row>
    </thead>
    <tbody>
      <Table.Row>
        <Table.Cell>
          {defaultValue.map((val) => val.form_factor).join(", ")}
        </Table.Cell>
      </Table.Row>
    </tbody>
  </Table.Component>
);
