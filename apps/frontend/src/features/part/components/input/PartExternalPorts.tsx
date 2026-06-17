import React, { useRef, useState } from "react";

import { ArrayFormApi } from "@/type/form";
import { Button, DeleteButton } from "@/ui/Button";
import { Input, OptionSelect } from "@/ui/Input";
import { ExternalPorts } from "@/utils/interface";
import * as PartExternalPorts from "@/utils/part/info/PartExternalPorts";

import { PortInputFields } from "../utils/Input";
import { Table } from "../utils/Table";
import { GenericListInputForm } from "../utils/TanstackForm";

function Component({
  form,
}: Readonly<{
  form: ArrayFormApi<PartExternalPorts.DTO>;
}>) {
  return (
    <form.Field name="items" mode="array">
      {(field) => {
        const values = field.state.value.map((val, index) => ({
          ...val,
          index,
        }));

        const remove = (index: number) => {
          field.removeValue(index);
        };

        const add = (type: ExternalPorts.Type, name: ExternalPorts) => {
          field.pushValue({ type, name, count: 0 });
        };

        const groupByType = Object.groupBy(values, (val) => val.type);

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
              {ExternalPorts.Type.options.map((type) => {
                const list = groupByType[type] ?? [];
                return list.map((item, idx) => (
                  <Table.Row key={`external-${item.type}-${item.name}`}>
                    {idx === 0 && (
                      <Table.Cell className="font-bold" rowSpan={list.length}>
                        {item.type}
                      </Table.Cell>
                    )}
                    <Table.Cell>
                      <form.Field name={`items[${item.index}].name`}>
                        {(subField) => (
                          <Input name={subField.name} value={subField.state.value} readOnly />
                        )}
                      </form.Field>
                      <form.Field name={`items[${item.index}].type`}>
                        {(subField) => (
                          <Input type="hidden" name={subField.name} value={subField.state.value} />
                        )}
                      </form.Field>
                    </Table.Cell>
                    <Table.Cell className="relative">
                      <form.Field name={`items[${item.index}].count`}>
                        {(subField) => (
                          <Input
                            type="number"
                            name={subField.name}
                            value={subField.state.value ?? 0}
                            onChange={(e) => subField.handleChange(Number(e.target.value))}
                          />
                        )}
                      </form.Field>
                      <DeleteButton onClick={() => remove(item.index)} />
                    </Table.Cell>
                  </Table.Row>
                ));
              })}
              <AddRow add={add} />
            </tbody>
          </Table.Component>
        );
      }}
    </form.Field>
  );
}

const PortTypes = {
  Network: ExternalPorts.Network.Type.options,
  Peripheral: ExternalPorts.Peripheral.Type.options,
  Display: ExternalPorts.Display.Type.options,
  Audio: ExternalPorts.Audio.Type.options,
  Interaction: ExternalPorts.Interaction.Type.options,
} as const;

type PortSubtypes = (typeof PortTypes)[ExternalPorts.Type][number];

function usePortType() {
  const [type, setType] = useState<ExternalPorts.Type>(ExternalPorts.Type.options[0]);
  const [port, setPort] = useState<(typeof PortTypes)[typeof type][number]>(PortTypes[type][0]);

  const setToType = (newType: ExternalPorts.Type) => {
    setType(newType);
    setPort(PortTypes[newType][0]);
  };

  const setToPort = (newPort: (typeof PortTypes)[typeof type][number]) => {
    setPort(newPort);
  };

  return [type, port, setToType, setToPort] as const;
}

function AddRow({
  add,
}: Readonly<{
  add: (type: ExternalPorts.Type, name: ExternalPorts) => void;
}>) {
  const NameInput = useRef<HTMLInputElement>(null);
  const [type, port, setType, setPort] = usePortType();

  const TargetComponent = PortInputFields[port];

  return (
    <Table.Row>
      <Table.Cell>
        <OptionSelect
          options={ExternalPorts.Type.options}
          value={type}
          onChange={(e) => setType(e.target.value as ExternalPorts.Type)}
          required
        />
        <OptionSelect
          options={PortTypes[type]}
          value={port}
          onChange={(e) => setPort(e.target.value as PortSubtypes)}
          required
        />
      </Table.Cell>
      <Table.Cell>
        <TargetComponent ref={NameInput} />
      </Table.Cell>
      <Table.Cell>
        <Button
          type="button"
          className="w-full p-0 border-0"
          onClick={() => add(type, NameInput.current!.value as ExternalPorts)}
        >
          Add
        </Button>
      </Table.Cell>
    </Table.Row>
  );
}

export default GenericListInputForm(Component, PartExternalPorts.Schemas.DTO);
