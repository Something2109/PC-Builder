import { Table } from "../utils/Table";
import PSUConnector from "@/utils/interface/part/info/PSUConnector";

export default ({ defaultValue }: { defaultValue: PSUConnector.DTO[] }) => (
  <Table.Component>
    <thead>
      <Table.Row>
        <Table.Cell>{PSUConnector.Label.type}</Table.Cell>
        <Table.Cell>{PSUConnector.Label.count}</Table.Cell>
      </Table.Row>
    </thead>
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
