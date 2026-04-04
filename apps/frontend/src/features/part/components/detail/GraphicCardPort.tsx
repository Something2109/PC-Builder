import { Table } from "../utils/Table";
import * as GraphicCardPort from "@/utils/part/info/GraphicCardPort";

const GraphicCardPortTable = ({
  defaultValue,
}: {
  defaultValue: GraphicCardPort.DTO[];
}) => (
  <Table.Component>
    <Table.Head>
      <Table.Row>
        <Table.Cell>{GraphicCardPort.Label.type}</Table.Cell>
        <Table.Cell>{GraphicCardPort.Label.name}</Table.Cell>
        <Table.Cell>{GraphicCardPort.Label.count}</Table.Cell>
      </Table.Row>
    </Table.Head>
    <tbody>
      {defaultValue.map((val) => (
        <Table.Row key={`port-${val.name}`}>
          <Table.Cell>{val.type}</Table.Cell>
          <Table.Cell>{val.name}</Table.Cell>
          <Table.Cell>{val.count}</Table.Cell>
        </Table.Row>
      ))}
    </tbody>
  </Table.Component>
);

export default GraphicCardPortTable;
