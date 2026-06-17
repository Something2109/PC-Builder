import * as PSUConnector from "@/utils/part/info/PSUConnector";

import { Table } from "../utils/Table";

const PSUConnectorTable = ({ defaultValue }: { defaultValue: PSUConnector.DTO[] }) => (
  <Table.Component>
    <Table.Head>
      <Table.Row>
        <Table.Cell>{PSUConnector.Label.type}</Table.Cell>
        <Table.Cell>{PSUConnector.Label.count}</Table.Cell>
      </Table.Row>
    </Table.Head>
    <tbody>
      {defaultValue.map((val) => (
        <Table.Row key={`port-${val.type}`}>
          <Table.Cell>{val.type}</Table.Cell>
          <Table.Cell>{val.count}</Table.Cell>
        </Table.Row>
      ))}
    </tbody>
  </Table.Component>
);

export default PSUConnectorTable;
