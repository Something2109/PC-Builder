import * as MainboardStorageConnector from "@pc-builder/shared/part/info/MainboardStorageConnector";

import { Table } from "../utils/Table";

const MainboardStorageConnectorTable = ({
  defaultValue,
}: {
  defaultValue: MainboardStorageConnector.DTO[];
}) => (
  <Table.Component>
    <Table.Head>
      <Table.Row>
        <Table.Cell>{MainboardStorageConnector.Label.form_factor}</Table.Cell>
        <Table.Cell>{MainboardStorageConnector.Label.count}</Table.Cell>
      </Table.Row>
    </Table.Head>
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

export default MainboardStorageConnectorTable;
