import React, { useRef } from "react";

import { ArrayFormApi } from "@/type/form";
import { Button, DeleteButton } from "@/ui/Button";
import { Input, OptionSelect } from "@/ui/Input";
import { Case } from "@pc-builder/shared/interface";
import * as CaseHardDriveSupport from "@pc-builder/shared/part/info/CaseHardDriveSupport";

import { Table } from "../utils/Table";
import { GenericListInputForm } from "../utils/TanstackForm";

function Component({
  form,
}: Readonly<{
  form: ArrayFormApi<CaseHardDriveSupport.DTO>;
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

        const add = (place: Case.HardDrivePlace, form_factor: Case.HardDriveFormFactor) => {
          field.pushValue({ place, form_factor, count: 0 });
        };

        const groups = Object.groupBy(values, (item) => item.place);

        return (
          <Table.Component>
            <Table.Head>
              <Table.Row>
                <Table.Cell>{CaseHardDriveSupport.Label.place}</Table.Cell>
                <Table.Cell>{CaseHardDriveSupport.Label.form_factor}</Table.Cell>
                <Table.Cell>{CaseHardDriveSupport.Label.count}</Table.Cell>
              </Table.Row>
            </Table.Head>
            <tbody>
              {Case.HardDrivePlace.options.map((place) => {
                const placeItems = groups[place] ?? [];

                const rowSpan = Math.min(
                  placeItems.length + 2,
                  Case.HardDriveFormFactor.options.length + 1
                );

                const options = Case.HardDriveFormFactor.options.filter((val) =>
                  placeItems.some(({ form_factor }) => val === form_factor)
                );

                return (
                  <React.Fragment key={place}>
                    <Table.Row>
                      <Table.Cell className="font-bold" rowSpan={rowSpan}>
                        {place}
                      </Table.Cell>
                    </Table.Row>
                    {placeItems.map(({ index, ...item }) => (
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
                    <AddRowOptions place={place} options={options} onAdd={add} />
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
  place,
  options,
  onAdd,
}: {
  place: Case.HardDrivePlace;
  options: Case.HardDriveFormFactor[];
  onAdd: (place: Case.HardDrivePlace, form_factor: Case.HardDriveFormFactor) => void;
}) {
  const FormFactorInput = useRef<HTMLSelectElement>(null);
  const handleAdd = () => {
    const form_factor = FormFactorInput.current?.value;
    if (form_factor) {
      onAdd(place, form_factor as Case.HardDriveFormFactor);
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

export default GenericListInputForm(Component, CaseHardDriveSupport.Schemas.DTO);
