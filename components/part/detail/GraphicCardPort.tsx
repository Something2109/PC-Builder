import { Table } from "../utils/Table";
import GraphicCardPort from "@/utils/interface/part/info/GraphicCardPort";

export default ({ defaultValue }: { defaultValue: GraphicCardPort.DTO[] }) => (
  <Table.Component>
    <thead>
      <Table.Row>
        <Table.Cell>{GraphicCardPort.Label.type}</Table.Cell>
        <Table.Cell>{GraphicCardPort.Label.name}</Table.Cell>
        <Table.Cell>{GraphicCardPort.Label.count}</Table.Cell>
      </Table.Row>
    </thead>
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
