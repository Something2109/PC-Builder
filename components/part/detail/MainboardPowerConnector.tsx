import { Table } from "../utils/Table";
import MainboardPowerConnector from "@/utils/interface/part/info/MainboardPowerConnector";

export default ({
  defaultValue,
}: {
  defaultValue: MainboardPowerConnector.DTO[];
}) => (
  <Table.Component>
    <Table.Head>
      <Table.Row>
        <Table.Cell>{MainboardPowerConnector.Label.type}</Table.Cell>
        <Table.Cell>{MainboardPowerConnector.Label.count}</Table.Cell>
      </Table.Row>
    </Table.Head>
    <tbody>
      {defaultValue.map((val) => (
        <Table.Row key={`power-${val.type}`}>
          <Table.Cell>{val.type}</Table.Cell>
          <Table.Cell>{val.count}</Table.Cell>
        </Table.Row>
      ))}
    </tbody>
  </Table.Component>
);
