import React, { useRef, useState } from "react";

import { ArrayFormApi } from "@/type/form";
import { Button, DeleteButton } from "@/ui/Button";
import { Input, OptionSelect } from "@/ui/Input";
import { ExternalPorts } from "@/utils/interface";
import * as GraphicCardPort from "@/utils/part/info/GraphicCardPort";

import { PortInputFields } from "../utils/Input";
import { Table } from "../utils/Table";
import { GenericListInputForm } from "../utils/TanstackForm";

function Component({
  form,
}: Readonly<{
  form: ArrayFormApi<GraphicCardPort.DTO>;
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

        const add = (type: ExternalPorts.Display.Type, name: ExternalPorts.Display) => {
          field.pushValue({ type, name, count: 0 });
        };

        const groupByType = Object.groupBy(values, (val) => val.type);

        return (
          <Table.Component>
            <Table.Head>
              <Table.Row>
                <Table.Cell>{GraphicCardPort.Label.type}</Table.Cell>
                <Table.Cell>{GraphicCardPort.Label.name}</Table.Cell>
                <Table.Cell>{GraphicCardPort.Label.count}</Table.Cell>
              </Table.Row>
            </Table.Head>
            <tbody>
              {Object.entries(groupByType).map(([typeKey, list]) => {
                if (!list) return null;
                return list.map((item, idx) => (
                  <Table.Row key={`port-${item.name}`}>
                    {idx === 0 && (
                      <Table.Cell className="font-bold" rowSpan={list.length}>
                        {typeKey}
                      </Table.Cell>
                    )}
                    <Table.Cell>
                      <form.Field name={`items[${item.index}].name`}>
                        {(subField) => (
                          <Input name={subField.name} value={subField.state.value} readOnly />
                        )}
                      </form.Field>
                    </Table.Cell>
                    <Table.Cell className="relative">
                      <form.Field name={`items[${item.index}].type`}>
                        {(subField) => (
                          <Input type="hidden" name={subField.name} value={subField.state.value} />
                        )}
                      </form.Field>
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

function AddRow({
  add,
}: Readonly<{
  add: (type: ExternalPorts.Display.Type, name: ExternalPorts.Display) => void;
}>) {
  const NameInput = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<ExternalPorts.Display.Type>(
    ExternalPorts.Display.Type.options[0]
  );
  const TargetComponent = PortInputFields[type];

  return (
    <Table.Row>
      <Table.Cell>
        <OptionSelect
          options={ExternalPorts.Display.Type.options}
          value={type}
          onChange={(e) => setType(e.target.value as ExternalPorts.Display.Type)}
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
          onClick={() => add(type, NameInput.current!.value as ExternalPorts.Display)}
        >
          Add
        </Button>
      </Table.Cell>
    </Table.Row>
  );
}

export default GenericListInputForm(Component, GraphicCardPort.Schemas.DTO);
