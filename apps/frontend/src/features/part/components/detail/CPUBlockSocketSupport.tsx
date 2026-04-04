import { Table } from "../utils/Table";
import * as CPUBlockSocketSupport from "@/utils/part/info/CPUBlockSocketSupport";

const CPUBlockSocketSupportTable = ({
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

export default CPUBlockSocketSupportTable;
