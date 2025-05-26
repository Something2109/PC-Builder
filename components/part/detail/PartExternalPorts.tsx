import { Table } from "../utils/Table";
import PartExternalPorts from "@/utils/interface/part/info/PartExternalPorts";

export default ({
  defaultValue,
}: {
  defaultValue: PartExternalPorts.Info[];
}) => (
  <Table.Component>
    <thead>
      <Table.Row>
        <Table.Cell>{PartExternalPorts.Label.type}</Table.Cell>
        <Table.Cell>{PartExternalPorts.Label.name}</Table.Cell>
        <Table.Cell>{PartExternalPorts.Label.count}</Table.Cell>
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
