import { Case, FormFactor } from "@pc-builder/shared/interface";
import * as CaseFanSupport from "@pc-builder/shared/part/info/CaseFanSupport";
import React, { useRef } from "react";

import { ArrayFormApi } from "@/type/form";
import { Button, DeleteButton } from "@/ui/Button";
import { Input, OptionSelect } from "@/ui/Input";

import { Table } from "../utils/Table";
import { GenericListInputForm } from "../utils/TanstackForm";

function Component({
  form,
}: Readonly<{
  form: ArrayFormApi<CaseFanSupport.DTO>;
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

        const add = (case_side: Case.Side, form_factor: FormFactor.Fan) => {
          field.pushValue({ case_side, form_factor, count: 0 });
        };

        const groups = Object.groupBy(values, (field) => field.case_side);

        return (
          <Table.Component>
            <Table.Head>
              <Table.Row>
                <Table.Cell>{CaseFanSupport.Label.case_side}</Table.Cell>
                <Table.Cell>{CaseFanSupport.Label.form_factor}</Table.Cell>
                <Table.Cell>{CaseFanSupport.Label.count}</Table.Cell>
              </Table.Row>
            </Table.Head>
            <tbody>
              {Case.Side.options.map((side) => {
                const sideItems = groups[side];

                if (!sideItems) return;

                const rowSpan = Math.min(sideItems.length + 2, FormFactor.Fan.options.length + 1);

                const options = FormFactor.Fan.options.filter((val) =>
                  sideItems.some(({ form_factor }) => val === form_factor)
                );

                return (
                  <React.Fragment key={side}>
                    <Table.Row>
                      <Table.Cell className="font-bold" rowSpan={rowSpan}>
                        {side}
                      </Table.Cell>
                    </Table.Row>
                    {sideItems.map(({ index, ...item }) => (
                      <Table.Row className="relative" key={item.form_factor}>
                        <Table.Cell>
                          <label>{item.form_factor}</label>
                        </Table.Cell>
                        <Table.Cell>
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
                        </Table.Cell>
                        <Table.Cell>
                          <DeleteButton onClick={() => remove(index)} />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                    <AddRowOptions side={side} options={options} onAdd={add} />
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

function AddRowOptions({
  side,
  options,
  onAdd,
}: {
  side: Case.Side;
  options: FormFactor.Fan[];
  onAdd: (side: Case.Side, form_factor: FormFactor.Fan) => void;
}) {
  const FormFactorInput = useRef<HTMLSelectElement>(null);
  const handleAdd = () => {
    const form_factor = FormFactorInput.current?.value;
    if (form_factor) {
      onAdd(side, form_factor as FormFactor.Fan);
    }
  };

  if (options.length === 0) return null;

  return (
    <Table.Row>
      <Table.Cell>
        <OptionSelect ref={FormFactorInput} options={options} required />
      </Table.Cell>
      <Table.Cell colSpan={2}>
        <Button type="button" className="w-full p-0 border-0" onClick={handleAdd}>
          Add
        </Button>
      </Table.Cell>
    </Table.Row>
  );
}

export default GenericListInputForm(Component, CaseFanSupport.Schemas.DTO);
