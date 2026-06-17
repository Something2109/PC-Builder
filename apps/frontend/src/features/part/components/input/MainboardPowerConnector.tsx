import React, { useRef } from "react";

import { ArrayFormApi } from "@/type/form";
import { Button, DeleteButton } from "@/ui/Button";
import { Input, OptionSelect } from "@/ui/Input";
import { InternalConnectors } from "@/utils/interface";
import * as MainboardPowerConnector from "@/utils/part/info/MainboardPowerConnector";

import { Table } from "../utils/Table";
import { GenericListInputForm } from "../utils/TanstackForm";

function Component({
  form,
}: Readonly<{
  form: ArrayFormApi<MainboardPowerConnector.DTO>;
}>) {
  const ConnectorInput = useRef<HTMLSelectElement>(null);

  return (
    <form.Field name="items" mode="array">
      {(field) => {
        const values = field.state.value ?? [];

        const exist = (type: InternalConnectors.Power.Mainboard) => {
          return values.some((val) => val.type === type);
        };

        const add = () => {
          const type = ConnectorInput.current?.value as
            | InternalConnectors.Power.Mainboard
            | undefined;
          if (!type) return;

          field.pushValue({ type, count: 0 });
        };

        const remove = (index: number) => {
          field.removeValue(index);
        };

        const options = InternalConnectors.Power.Mainboard.options.filter((val) => !exist(val));

        return (
          <Table.Component>
            <Table.Head>
              <Table.Row>
                <Table.Cell>{MainboardPowerConnector.Label.type}</Table.Cell>
                <Table.Cell>{MainboardPowerConnector.Label.count}</Table.Cell>
              </Table.Row>
            </Table.Head>
            <tbody>
              {values.map((item, index) => (
                <Table.Row key={item.type}>
                  <Table.Cell>
                    <label>{item.type}</label>
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

export default GenericListInputForm(Component, MainboardPowerConnector.Schemas.DTO);
