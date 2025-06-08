import { Table } from "../utils/Table";
import PartExternalPorts from "@/utils/interface/part/info/PartExternalPorts";
import { ExternalPorts } from "@/utils/interface/utils";

export default ({
  defaultValue,
}: {
  defaultValue: PartExternalPorts.DTO[];
}) => {
  const groupByType = Object.groupBy(defaultValue, (val) => val.type);

  return (
    <Table.Component>
      <thead>
        <Table.Row>
          <Table.Cell>{PartExternalPorts.Label.type}</Table.Cell>
          <Table.Cell>{PartExternalPorts.Label.name}</Table.Cell>
          <Table.Cell>{PartExternalPorts.Label.count}</Table.Cell>
        </Table.Row>
      </thead>
      <tbody>
        {ExternalPorts.Type.options.map((type) =>
          groupByType[type]?.map((value, index, arr) => (
            <Table.Row key={`External-${type}-${value.name}`}>
              {index === 0 && (
                <Table.Cell rowSpan={arr.length}>{type}</Table.Cell>
              )}
              <Table.Cell>{value.name}</Table.Cell>
              <Table.Cell>{value.count}</Table.Cell>
            </Table.Row>
          ))
        )}
      </tbody>
    </Table.Component>
  );
};
