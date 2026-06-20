import { SuffixDisplay, UnitDisplay } from "@/ui/Display";
import * as CPUCoreConfig from "@pc-builder/shared/part/info/CPUCoreConfig";
import { FrequencyUnits } from "@pc-builder/shared/Units";

import { Table } from "../utils/Table";

const CPUCoreConfigTable = ({ defaultValue }: { defaultValue: CPUCoreConfig.DTO[] }) => (
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

export default CPUCoreConfigTable;
