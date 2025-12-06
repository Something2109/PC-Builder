import { Table } from "../utils/Table";
import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import * as CPUCoreConfig from "@/utils/part/info/CPUCoreConfig";
import { FrequencyUnits } from "@/utils/Units";

export default ({ defaultValue }: { defaultValue: CPUCoreConfig.DTO[] }) => (
  <Table.Component>
    <Table.Head>
      <Table.Row>
        <Table.Cell>{CPUCoreConfig.Label.name}</Table.Cell>
        <Table.Cell>{CPUCoreConfig.Label.count}</Table.Cell>
        <Table.Cell>{CPUCoreConfig.Label.base_frequency}</Table.Cell>
        <Table.Cell>{CPUCoreConfig.Label.turbo_frequency}</Table.Cell>
      </Table.Row>
    </Table.Head>
    <tbody>
      {defaultValue.map((val) => (
        <Table.Row key={`core-${val.name}`}>
          <Table.Cell>{val.name}</Table.Cell>
          <Table.Cell>
            <SuffixDisplay suffix="core(s)">{val.count}</SuffixDisplay>
          </Table.Cell>
          <Table.Cell>
            <UnitDisplay
              Unit={FrequencyUnits}
              defaultUnit="GHz"
              defaultValue={val.base_frequency}
            />
          </Table.Cell>
          <Table.Cell>
            <UnitDisplay
              Unit={FrequencyUnits}
              defaultUnit="GHz"
              defaultValue={val.turbo_frequency}
            />
          </Table.Cell>
        </Table.Row>
      ))}
    </tbody>
  </Table.Component>
);
