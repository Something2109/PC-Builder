import React, { useRef } from "react";

import { ArrayFormApi } from "@/type/form";
import { Button, DeleteButton } from "@/ui/Button";
import { Input, OptionSelect } from "@/ui/Input";
import { InternalConnectors } from "@pc-builder/shared/interface";
import * as MainboardStorageConnector from "@pc-builder/shared/part/info/MainboardStorageConnector";

import { Table } from "../utils/Table";
import { GenericListInputForm } from "../utils/TanstackForm";

function Component({
  form,
}: Readonly<{
  form: ArrayFormApi<MainboardStorageConnector.DTO>;
}>) {
  const ConnectorInput = useRef<HTMLSelectElement>(null);

  return (
    <form.Field name="items" mode="array">
      {(field) => {
        const values = field.state.value ?? [];

        const exist = (form_factor: InternalConnectors.Storage) => {
          return values.some((val) => val.form_factor === form_factor);
        };

        const add = () => {
          const form_factor = ConnectorInput.current?.value as
            | InternalConnectors.Storage
            | undefined;
          if (!form_factor) return;

          field.pushValue({ form_factor, count: 0 });
        };

        const remove = (index: number) => {
          field.removeValue(index);
        };

        const options = InternalConnectors.Storage.Options.filter((val) => !exist(val));

        return (
          <Table.Component>
            <Table.Head>
              <Table.Row>
                <Table.Cell>{MainboardStorageConnector.Label.form_factor}</Table.Cell>
                <Table.Cell>{MainboardStorageConnector.Label.count}</Table.Cell>
              </Table.Row>
            </Table.Head>
            <tbody>
              {values.map((item, index) => (
                <Table.Row key={item.form_factor}>
                  <Table.Cell>
                    <label>{item.form_factor}</label>
                  </Table.Cell>
                  <Table.Cell className="relative">
                    <form.Field name={`items[${index}].count`}>
                      {(subField) => (
                        <Input
                          type="number"
                          name={subField.name}
                          value={subField.state.value ?? 0}
                          onChange={(e) => subField.handleChange(Number(e.target.value))}
                        />
                      )}
                    </form.Field>
                    <DeleteButton onClick={() => remove(index)} />
                  </Table.Cell>
                </Table.Row>
              ))}
              {options.length > 0 && (
                <Table.Row>
                  <Table.Cell>
                    <OptionSelect ref={ConnectorInput} options={options} required />
                  </Table.Cell>
                  <Table.Cell>
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

export default GenericListInputForm(Component, MainboardStorageConnector.Schemas.DTO);
