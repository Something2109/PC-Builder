import { Table } from "../utils/Table";
import * as PartExternalPorts from "@/utils/part/info/PartExternalPorts";
import { ExternalPorts } from "@/utils/interface";

export default ({
  defaultValue,
}: {
  defaultValue: PartExternalPorts.DTO[];
}) => {
  const groupByType = Object.groupBy(defaultValue, (val) => val.type);

  return (
    <Table.Component>
      <Table.Head>
        <Table.Row>
          <Table.Cell>{PartExternalPorts.Label.type}</Table.Cell>
          <Table.Cell>{PartExternalPorts.Label.name}</Table.Cell>
          <Table.Cell>{PartExternalPorts.Label.count}</Table.Cell>
        </Table.Row>
      </Table.Head>
      <tbody>
        {ExternalPorts.Type.options.map((type) =>
          groupByType[type]?.map((value, index, arr) => (
            <Table.Row key={`External-${type}-${value.name}`}>
              {index === 0 && (
                <Table.Cell className="font-bold" rowSpan={arr.length}>
                  {type}
                </Table.Cell>
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
