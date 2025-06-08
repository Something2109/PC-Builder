import { Table } from "../utils/Table";
import MainboardStorageConnector from "@/utils/interface/part/info/MainboardStorageConnector";

export default ({
  defaultValue,
}: {
  defaultValue: MainboardStorageConnector.DTO[];
}) => (
  <Table.Component>
    <thead>
      <Table.Row>
        <Table.Cell>{MainboardStorageConnector.Label.form_factor}</Table.Cell>
        <Table.Cell>{MainboardStorageConnector.Label.count}</Table.Cell>
      </Table.Row>
    </thead>
    <tbody>
      {defaultValue.map((val) => (
        <Table.Row key={`storage-${val.form_factor}`}>
          <Table.Cell>{val.form_factor}</Table.Cell>
          <Table.Cell>{val.count}</Table.Cell>
        </Table.Row>
      ))}
    </tbody>
  </Table.Component>
);
