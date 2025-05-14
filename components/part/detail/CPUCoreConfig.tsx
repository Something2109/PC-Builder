import { Table } from "../utils/Table";
import CPUCoreConfig from "@/utils/interface/part/info/CPUCoreConfig";

export default ({ defaultValue }: { defaultValue: CPUCoreConfig.Info[] }) => (
  <Table.Component>
    <thead>
      <Table.Row>
        <Table.Cell>{CPUCoreConfig.Label.name}</Table.Cell>
        <Table.Cell>{CPUCoreConfig.Label.count}</Table.Cell>
        <Table.Cell>{CPUCoreConfig.Label.base_frequency}</Table.Cell>
        <Table.Cell>{CPUCoreConfig.Label.turbo_frequency}</Table.Cell>
      </Table.Row>
    </thead>
    <tbody>
      {defaultValue.map((val) => (
        <Table.Row key={`core-${val.name}`}>
          <Table.Cell>{val.name}</Table.Cell>
          <Table.Cell>{val.count}</Table.Cell>
          <Table.Cell>{val.base_frequency}</Table.Cell>
          <Table.Cell>{val.turbo_frequency}</Table.Cell>
        </Table.Row>
      ))}
    </tbody>
  </Table.Component>
);
