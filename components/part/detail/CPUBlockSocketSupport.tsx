import { Table } from "../utils/Table";
import CPUBlockSocketSupport from "@/utils/interface/part/info/CPUBlockSocketSupport";

export default ({
  defaultValue,
}: {
  defaultValue: CPUBlockSocketSupport.DTO[];
}) => (
  <Table.Component>
    <Table.Head>
      <Table.Row>
        <Table.Cell>{CPUBlockSocketSupport.Label.socket}</Table.Cell>
      </Table.Row>
    </Table.Head>
    <tbody>
      <Table.Row>
        <Table.Cell>
          {defaultValue.map((val) => val.socket).join(", ")}
        </Table.Cell>
      </Table.Row>
    </tbody>
  </Table.Component>
);
