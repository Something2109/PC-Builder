import { useRef } from "react";

import { ArrayFormApi } from "@/type/form";
import { Button, DeleteButton } from "@/ui/Button";
import { Input, UnitInput } from "@/ui/Input";
import * as CPUCoreConfig from "@/utils/part/info/CPUCoreConfig";
import { FrequencyUnits } from "@/utils/Units";

import { Table } from "../utils/Table";
import { GenericListInputForm } from "../utils/TanstackForm";

function Component({
  form,
}: Readonly<{
  form: ArrayFormApi<CPUCoreConfig.DTO>;
}>) {
  const AddInput = useRef<HTMLInputElement>(null);

  return (
    <form.Field name="items" mode="array">
      {(field) => {
        const add = () => {
          const name = AddInput.current?.value;
          if (!name) return;

          field.pushValue({
            name,
            base_frequency: 0,
            turbo_frequency: 0,
            count: 0,
          });
          if (AddInput.current) AddInput.current.value = "";
        };

        return (
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
              {(field.state.value ?? []).map((_, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <form.Field name={`items[${index}].name`}>
                      {(subField) => (
                        <Input
                          name={subField.name}
                          defaultValue={subField.state.value}
                          onChange={(e) => subField.handleChange(e.target.value)}
                        />
                      )}
                    </form.Field>
                  </Table.Cell>
                  <Table.Cell>
                    <form.Field name={`items[${index}].count`}>
                      {(subField) => (
                        <Input
                          type="number"
                          name={subField.name}
                          defaultValue={subField.state.value ?? 0}
                          onChange={(e) => subField.handleChange(Number(e.target.value))}
                        />
                      )}
                    </form.Field>
                  </Table.Cell>
                  <Table.Cell>
                    <form.Field name={`items[${index}].base_frequency`}>
                      {(subField) => (
                        <UnitInput
                          Unit={FrequencyUnits}
                          name={subField.name}
                          defaultValue={subField.state.value ?? 0}
                          onChange={(e) => subField.handleChange(Number(e.target.value))}
                          defaultUnit="GHz"
                        />
                      )}
                    </form.Field>
                  </Table.Cell>
                  <Table.Cell className="relative">
                    <form.Field name={`items[${index}].turbo_frequency`}>
                      {(subField) => (
                        <UnitInput
                          Unit={FrequencyUnits}
                          name={subField.name}
                          defaultValue={subField.state.value ?? 0}
                          onChange={(e) => subField.handleChange(Number(e.target.value))}
                          defaultUnit="GHz"
                        />
                      )}
                    </form.Field>
                    <DeleteButton onClick={() => field.removeValue(index)} />
                  </Table.Cell>
                </Table.Row>
              ))}
              <Table.Row>
                <Table.Cell>
                  <Input ref={AddInput} />
                </Table.Cell>
                <Table.Cell colSpan={3}>
                  <Button type="button" className="w-full p-0 border-0" onClick={add}>
                    Add
                  </Button>
                </Table.Cell>
              </Table.Row>
            </tbody>
          </Table.Component>
        );
      }}
    </form.Field>
  );
}

export default GenericListInputForm(Component, CPUCoreConfig.Schemas.DTO);
