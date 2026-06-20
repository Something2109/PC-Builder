import React from "react";

import { ArrayFormApi } from "@/type/form";
import { DeleteButton } from "@/ui/Button";
import { Input, OptionSelect } from "@/ui/Input";
import { InternalConnectors } from "@pc-builder/shared/interface";
import * as PSUConnector from "@pc-builder/shared/part/info/PSUConnector";

import { Table } from "../utils/Table";
import { GenericListInputForm } from "../utils/TanstackForm";

function Component({
  form,
}: Readonly<{
  form: ArrayFormApi<PSUConnector.DTO>;
}>) {
  return (
    <form.Field name="items" mode="array">
      {(field) => {
        const values = field.state.value ?? [];

        const exist = (type: InternalConnectors.Power) => {
          return values.some((val) => val.type === type);
        };

        const add = (type: InternalConnectors.Power) => {
          if (!type) return;

          field.pushValue({ type, count: 0 });
        };

        const remove = (index: number) => {
          field.removeValue(index);
        };

        const options = InternalConnectors.Power.Options.filter((val) => !exist(val));

        return (
          <Table.Component>
            <Table.Head>
              <Table.Row>
                <Table.Cell>{PSUConnector.Label.type}</Table.Cell>
                <Table.Cell>{PSUConnector.Label.count}</Table.Cell>
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
                  <Table.Cell colSpan={2}>
                    <label htmlFor="form_factor">Add: </label>
                    <OptionSelect
                      id="form_factor"
                      options={options}
                      value=""
                      onChange={(e) => add(e.target.value as InternalConnectors.Power)}
                    />
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

export default GenericListInputForm(Component, PSUConnector.Schemas.DTO);
