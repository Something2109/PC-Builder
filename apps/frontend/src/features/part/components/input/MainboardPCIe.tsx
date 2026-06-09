import React, { useRef } from "react";

import { ArrayFormApi } from "@/type/form";
import { Button, DeleteButton } from "@/ui/Button";
import { Input, OptionSelect } from "@/ui/Input";
import { InternalConnectors } from "@/utils/interface";
import * as MainboardPCIe from "@/utils/part/info/MainboardPCIe";

import { Table } from "../utils/Table";
import { GenericListInputForm } from "../utils/TanstackForm";

function Component({
  form,
}: Readonly<{
  form: ArrayFormApi<MainboardPCIe.DTO>;
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

        const add = (
          controller: InternalConnectors.PCIe.Controller,
          version: number,
          width: InternalConnectors.PCIe.Width
        ) => {
          field.pushValue({ controller, version, width, count: 0 });
        };

        const groups = Object.groupBy(values, (val) => val.controller);

        return (
          <Table.Component>
            <Table.Head>
              <Table.Row>
                <Table.Cell>{MainboardPCIe.Label.controller}</Table.Cell>
                <Table.Cell>{MainboardPCIe.Label.version}</Table.Cell>
                <Table.Cell>{MainboardPCIe.Label.width}</Table.Cell>
                <Table.Cell>{MainboardPCIe.Label.count}</Table.Cell>
              </Table.Row>
            </Table.Head>
            <tbody>
              {InternalConnectors.PCIe.Controller.options.map((controller) => {
                const controllerItems = groups[controller] ?? [];

                const rowSpan = controllerItems.length + 2;

                return (
                  <React.Fragment key={controller}>
                    <Table.Row>
                      <Table.Cell className="font-bold" rowSpan={rowSpan}>
                        {controller}
                      </Table.Cell>
                    </Table.Row>
                    {controllerItems.map((item) => (
                      <Table.Row
                        className="relative"
                        key={`${item.version}-${item.width}`}
                      >
                        <Table.Cell>
                          <form.Field name={`items[${item.index}].version`}>
                            {(subField) => (
                              <Input
                                name={subField.name}
                                value={subField.state.value}
                                readOnly
                              />
                            )}
                          </form.Field>
                        </Table.Cell>
                        <Table.Cell>
                          <form.Field name={`items[${item.index}].width`}>
                            {(subField) => (
                              <Input
                                name={subField.name}
                                value={subField.state.value}
                                readOnly
                              />
                            )}
                          </form.Field>
                        </Table.Cell>
                        <Table.Cell>
                          <form.Field name={`items[${item.index}].controller`}>
                            {(subField) => (
                              <Input
                                type="hidden"
                                name={subField.name}
                                value={subField.state.value}
                              />
                            )}
                          </form.Field>
                          <form.Field name={`items[${item.index}].count`}>
                            {(subField) => (
                              <Input
                                type="number"
                                name={subField.name}
                                value={subField.state.value ?? 0}
                                onChange={(e) =>
                                  subField.handleChange(Number(e.target.value))
                                }
                              />
                            )}
                          </form.Field>
                        </Table.Cell>
                        <Table.Cell>
                          <DeleteButton onClick={() => remove(item.index)} />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                    <AddRow
                      controller={
                        controller as InternalConnectors.PCIe.Controller
                      }
                      onAdd={add}
                    />
                  </React.Fragment>
                );
              })}
            </tbody>
          </Table.Component>
        );
      }}
    </form.Field>
  );
}

function AddRow({
  controller,
  onAdd,
}: Readonly<{
  controller: InternalConnectors.PCIe.Controller;
  onAdd: (
    controller: InternalConnectors.PCIe.Controller,
    version: number,
    width: InternalConnectors.PCIe.Width
  ) => void;
}>) {
  const VersionInput = useRef<HTMLInputElement>(null);
  const WidthInput = useRef<HTMLSelectElement>(null);

  const handleAdd = () => {
    const version = Number(VersionInput.current?.value ?? 0);
    const width = WidthInput.current?.value as InternalConnectors.PCIe.Width;
    onAdd(controller, version, width);
  };

  return (
    <Table.Row>
      <Table.Cell>
        <Input ref={VersionInput} type="number" defaultValue={0} />
      </Table.Cell>
      <Table.Cell>
        <OptionSelect
          ref={WidthInput}
          options={InternalConnectors.PCIe.Width.options}
          required
        />
      </Table.Cell>
      <Table.Cell>
        <Button
          type="button"
          className="w-full p-0 border-0"
          onClick={handleAdd}
        >
          Add
        </Button>
      </Table.Cell>
    </Table.Row>
  );
}

export default GenericListInputForm(Component, MainboardPCIe.Schemas.DTO);
