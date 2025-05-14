import { Table } from "../utils/Table";
import ProcessorMemorySpec from "@/utils/interface/part/info/ProcessorMemorySpec";

export default ({
  defaultValue,
}: {
  defaultValue: ProcessorMemorySpec.Info[];
}) => (
  <Table.Component>
    <thead>
      <Table.Row>
        <Table.Cell>{ProcessorMemorySpec.Label.type}</Table.Cell>
        <Table.Cell>{ProcessorMemorySpec.Label.capacity}</Table.Cell>
        <Table.Cell>{ProcessorMemorySpec.Label.channel_count}</Table.Cell>
        <Table.Cell>{ProcessorMemorySpec.Label.bus}</Table.Cell>
        <Table.Cell>{ProcessorMemorySpec.Label.bandwidth}</Table.Cell>
      </Table.Row>
    </thead>
    <tbody>
      {defaultValue.map((val) => (
        <Table.Row key={`memory-${val.type}-${val.bus}`}>
          <Table.Cell>{val.type}</Table.Cell>
          <Table.Cell>{val.capacity}</Table.Cell>
          <Table.Cell>{val.channel_count}</Table.Cell>
          <Table.Cell>{val.bus}</Table.Cell>
          <Table.Cell>{val.bandwidth}</Table.Cell>
        </Table.Row>
      ))}
    </tbody>
  </Table.Component>
);
