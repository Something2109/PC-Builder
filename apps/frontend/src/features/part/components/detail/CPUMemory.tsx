import { Table } from "../utils/Table";
import { SuffixDisplay, UnitDisplay } from "@/ui/Display";
import * as CPUMemory from "@/utils/part/info/CPUMemory";
import { MemorySpeedUnit, MemoryUnits, TransferSpeedUnit } from "@/utils/Units";

const CPUMemoryTable = ({
  defaultValue,
}: {
  defaultValue: CPUMemory.DTO[];
}) => (
  <Table.Component>
    <Table.Head>
      <Table.Row>
        <Table.Cell>{CPUMemory.Label.type}</Table.Cell>
        <Table.Cell>{CPUMemory.Label.speed}</Table.Cell>
        <Table.Cell>{CPUMemory.Label.capacity}</Table.Cell>
        <Table.Cell>{CPUMemory.Label.channel_count}</Table.Cell>
        <Table.Cell>{CPUMemory.Label.bandwidth}</Table.Cell>
      </Table.Row>
    </Table.Head>
    <tbody>
      {defaultValue.map((val) => (
        <Table.Row key={`memory-${val.type}-${val.speed}`}>
          <Table.Cell>{val.type}</Table.Cell>
          <Table.Cell>
            <UnitDisplay
              Unit={TransferSpeedUnit}
              defaultUnit="MT/s"
              defaultValue={val.speed}
            />
          </Table.Cell>
          <Table.Cell>
            <UnitDisplay
              Unit={MemoryUnits}
              defaultUnit="GB"
              defaultValue={val.capacity}
            />
          </Table.Cell>
          <Table.Cell>
            <SuffixDisplay suffix="channel(s)">
              {val.channel_count}
            </SuffixDisplay>
          </Table.Cell>
          <Table.Cell>
            <UnitDisplay
              Unit={MemorySpeedUnit}
              defaultUnit="GB/s"
              defaultValue={val.bandwidth}
            />
          </Table.Cell>
        </Table.Row>
      ))}
    </tbody>
  </Table.Component>
);

export default CPUMemoryTable;
