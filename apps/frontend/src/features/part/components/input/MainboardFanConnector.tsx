import React, { useRef } from "react";

import { ArrayFormApi } from "@/type/form";
import { Button, DeleteButton } from "@/ui/Button";
import { Input, OptionSelect } from "@/ui/Input";
import { InternalConnectors } from "@/utils/interface";
import * as MainboardFanConnector from "@/utils/part/info/MainboardFanConnector";

import { Table } from "../utils/Table";
import { GenericListInputForm } from "../utils/TanstackForm";

function Component({
  form,
}: Readonly<{
  form: ArrayFormApi<MainboardFanConnector.DTO>;
}>) {
  return (
    <form.Field name="items" mode="array">
      {(field) => {
        const values = field.state.value ?? [];

        const remove = (index: number) => {
          field.removeValue(index);
        };

        const add = (
          connector: InternalConnectors.Fan.Connector,
          type: InternalConnectors.Fan.Type
        ) => {
          field.pushValue({ connector, type, count: 0 });
        };

        return (
          <Table.Component>
            <Table.Head>
              <Table.Row>
                <Table.Cell>{MainboardFanConnector.Label.type}</Table.Cell>
                <Table.Cell>{MainboardFanConnector.Label.connector}</Table.Cell>
                <Table.Cell>{MainboardFanConnector.Label.count}</Table.Cell>
              </Table.Row>
            </Table.Head>
            <tbody>
              {values.map((item, index) => (
                <Table.Row key={`${item.connector}-${item.type}`}>
                  <Table.Cell>
                    <form.Field name={`items[${index}].type`}>
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
  add: (connector: InternalConnectors.Fan.Connector, type: InternalConnectors.Fan.Type) => void;
}>) {
  const ConnectorInput = useRef<HTMLSelectElement>(null);
  const TypeInput = useRef<HTMLSelectElement>(null);

  const onAdd = () => {
    const connector = ConnectorInput.current!.value as InternalConnectors.Fan.Connector;
    const type = TypeInput.current!.value as InternalConnectors.Fan.Type;

    add(connector, type);
  };

  return (
    <Table.Row>
      <Table.Cell>
        <OptionSelect ref={TypeInput} options={InternalConnectors.Fan.Type.options} required />
      </Table.Cell>
      <Table.Cell>
        <OptionSelect
          ref={ConnectorInput}
          options={InternalConnectors.Fan.Connector.options}
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

export default GenericListInputForm(Component, MainboardFanConnector.Schemas.DTO);
