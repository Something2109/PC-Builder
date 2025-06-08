import { Table } from "../utils/Table";
import MainboardFanConnector from "@/utils/interface/part/info/MainboardFanConnector";

export default ({
  defaultValue,
}: {
  defaultValue: MainboardFanConnector.DTO[];
}) => (
  <Table.Component>
    <thead>
      <Table.Row>
        <Table.Cell>{MainboardFanConnector.Label.type}</Table.Cell>
        <Table.Cell>{MainboardFanConnector.Label.connector}</Table.Cell>
        <Table.Cell>{MainboardFanConnector.Label.count}</Table.Cell>
      </Table.Row>
    </thead>
    <tbody>
      {defaultValue.map((val) => (
        <Table.Row key={`port-${val.type}-${val.connector}`}>
          <Table.Cell>{val.type}</Table.Cell>
          <Table.Cell>{val.connector}</Table.Cell>
          <Table.Cell>{val.count}</Table.Cell>
        </Table.Row>
      ))}
    </tbody>
  </Table.Component>
);
