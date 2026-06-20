import React, { useRef } from "react";

import { ArrayFormApi } from "@/type/form";
import { Button, DeleteButton } from "@/ui/Button";
import { Input, OptionSelect } from "@/ui/Input";
import { ExternalPorts } from "@pc-builder/shared/interface";
import * as MainboardUSBConnector from "@pc-builder/shared/part/info/MainboardUSBConnector";

import { Table } from "../utils/Table";
import { GenericListInputForm } from "../utils/TanstackForm";

function Component({
  form,
}: Readonly<{
  form: ArrayFormApi<MainboardUSBConnector.DTO>;
}>) {
  return (
    <form.Field name="items" mode="array">
      {(field) => {
        const values = field.state.value ?? [];

        const remove = (index: number) => {
          field.removeValue(index);
        };

        const add = (
          generation: ExternalPorts.Peripheral.USB.Generation,
          connector: ExternalPorts.Peripheral.USB.Connector
        ) => {
          field.pushValue({ generation, connector, count: 0 });
        };

        return (
          <Table.Component>
            <Table.Head>
              <Table.Row>
                <Table.Cell>{MainboardUSBConnector.Label.generation}</Table.Cell>
                <Table.Cell>{MainboardUSBConnector.Label.connector}</Table.Cell>
                <Table.Cell>{MainboardUSBConnector.Label.count}</Table.Cell>
              </Table.Row>
            </Table.Head>
            <tbody>
              {values.map((item, index) => (
                <Table.Row key={`${item.generation}-${item.connector}`}>
                  <Table.Cell>
                    <form.Field name={`items[${index}].generation`}>
                      {(subField) => (
                        <Input name={subField.name} value={subField.state.value} readOnly />
                      )}
                    </form.Field>
                  </Table.Cell>
                  <Table.Cell>
                    <form.Field name={`items[${index}].connector`}>
                      {(subField) => (
                        <Input name={subField.name} value={subField.state.value} readOnly />
                      )}
                    </form.Field>
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
              <AddRow add={add} />
            </tbody>
          </Table.Component>
        );
      }}
    </form.Field>
  );
}

function AddRow({
  add,
}: Readonly<{
  add: (
    generation: ExternalPorts.Peripheral.USB.Generation,
    connector: ExternalPorts.Peripheral.USB.Connector
  ) => void;
}>) {
  const GenerationInput = useRef<HTMLSelectElement>(null);
  const ConnectorInput = useRef<HTMLSelectElement>(null);

  const onAdd = () => {
    const generation = GenerationInput.current!.value as ExternalPorts.Peripheral.USB.Generation;
    const connector = ConnectorInput.current!.value as ExternalPorts.Peripheral.USB.Connector;

    add(generation, connector);
  };

  return (
    <Table.Row>
      <Table.Cell>
        <OptionSelect
          ref={GenerationInput}
          options={ExternalPorts.Peripheral.USB.Generation.options}
          required
        />
      </Table.Cell>
      <Table.Cell>
        <OptionSelect
          ref={ConnectorInput}
          options={ExternalPorts.Peripheral.USB.Connector.options}
          required
        />
      </Table.Cell>
      <Table.Cell>
        <Button type="button" className="w-full p-0 border-0" onClick={onAdd}>
          Add
        </Button>
      </Table.Cell>
    </Table.Row>
  );
}

export default GenericListInputForm(Component, MainboardUSBConnector.Schemas.DTO);
