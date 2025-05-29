import { Table } from "../utils/Table";
import CPUMemory from "@/utils/interface/part/info/CPUMemory";

export default ({ defaultValue }: { defaultValue: CPUMemory.Info[] }) => (
  <Table.Component>
    <thead>
      <Table.Row>
        <Table.Cell>{CPUMemory.Label.type}</Table.Cell>
        <Table.Cell>{CPUMemory.Label.speed}</Table.Cell>
        <Table.Cell>{CPUMemory.Label.capacity}</Table.Cell>
        <Table.Cell>{CPUMemory.Label.channel_count}</Table.Cell>
        <Table.Cell>{CPUMemory.Label.bandwidth}</Table.Cell>
      </Table.Row>
    </thead>
    <tbody>
      {defaultValue.map((val) => (
        <Table.Row key={`memory-${val.type}-${val.speed}`}>
          <Table.Cell>{val.type}</Table.Cell>
          <Table.Cell>{val.speed}</Table.Cell>
          <Table.Cell>{val.capacity}</Table.Cell>
          <Table.Cell>{val.channel_count}</Table.Cell>
          <Table.Cell>{val.bandwidth}</Table.Cell>
        </Table.Row>
      ))}
    </tbody>
  </Table.Component>
);
