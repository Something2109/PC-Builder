import { InternalConnectors } from "@pc-builder/shared/interface";
import * as CPUMemory from "@pc-builder/shared/part/info/CPUMemory";
import { MemorySpeedUnit, MemoryUnits, TransferSpeedUnit } from "@pc-builder/shared/Units";
import { useRef } from "react";

import { ArrayFormApi } from "@/type/form";
import { Button, DeleteButton } from "@/ui/Button";
import { OptionSelect, SuffixInput, UnitInput } from "@/ui/Input";

import { Table } from "../utils/Table";
import { GenericListInputForm } from "../utils/TanstackForm";

function Component({
  form,
}: Readonly<{
  form: ArrayFormApi<CPUMemory.DTO>;
}>) {
  const ConnectorInput = useRef<HTMLSelectElement>(null);

  return (
    <form.Field name="items" mode="array">
      {(field) => {
        const values = field.state.value ?? [];

        const exist = (type: string) => {
          return values.some((val) => val.type === type);
        };

        const add = () => {
          const type = ConnectorInput.current?.value as InternalConnectors.RAM | undefined;
          if (!type) return;

          field.pushValue({
            type,
            speed: 0,
            capacity: 0,
            channel_count: 0,
            bandwidth: 0,
          });
        };

        const options = InternalConnectors.RAM.options.filter((val) => !exist(val));

        return (
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
              {values.map((item, index) => (
                <Table.Row key={item.type}>
                  <Table.Cell>
                    <label>{item.type}</label>
                  </Table.Cell>
                  <Table.Cell>
                    <form.Field name={`items[${index}].speed`}>
                      {(subField) => (
                        <UnitInput
                          name={subField.name}
                          Unit={TransferSpeedUnit}
                          defaultUnit="MT/s"
                          defaultValue={subField.state.value ?? 0}
                          onChange={(e) => subField.handleChange(Number(e.target.value))}
                        />
                      )}
                    </form.Field>
                  </Table.Cell>
                  <Table.Cell>
                    <form.Field name={`items[${index}].capacity`}>
                      {(subField) => (
                        <UnitInput
                          name={subField.name}
                          Unit={MemoryUnits}
                          defaultUnit="GB"
                          defaultValue={subField.state.value ?? 0}
                          onChange={(e) => subField.handleChange(Number(e.target.value))}
                        />
                      )}
                    </form.Field>
                  </Table.Cell>
                  <Table.Cell>
                    <form.Field name={`items[${index}].channel_count`}>
                      {(subField) => (
                        <SuffixInput
                          type="number"
                          name={subField.name}
                          suffix="channel(s)"
                          defaultValue={subField.state.value ?? 0}
                          onChange={(e) => subField.handleChange(Number(e.target.value))}
                        />
                      )}
                    </form.Field>
                  </Table.Cell>
                  <Table.Cell className="relative">
                    <form.Field name={`items[${index}].bandwidth`}>
                      {(subField) => (
                        <UnitInput
                          Unit={MemorySpeedUnit}
                          defaultUnit="GB/s"
                          name={subField.name}
                          defaultValue={subField.state.value ?? 0}
                          onChange={(e) => subField.handleChange(Number(e.target.value))}
                        />
                      )}
                    </form.Field>
                    <DeleteButton onClick={() => field.removeValue(index)} />
                  </Table.Cell>
                </Table.Row>
              ))}
              {options.length > 0 && (
                <Table.Row>
                  <Table.Cell>
                    <OptionSelect ref={ConnectorInput} options={options} required />
                  </Table.Cell>
                  <Table.Cell colSpan={4}>
                    <Button type="button" className="w-full p-0 border-0" onClick={add}>
                      Add
                    </Button>
                  </Table.Cell>
                </Table.Row>
              )}
            </tbody>
          </Table.Component>
        );
      }}
    </form.Field>
  );
}

export default GenericListInputForm(Component, CPUMemory.Schemas.DTO);
