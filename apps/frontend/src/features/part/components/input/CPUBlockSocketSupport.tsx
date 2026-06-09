import { ArrayFormApi } from "@/type/form";
import { Button, DeleteButton } from "@/ui/Button";
import { Input } from "@/ui/Input";
import * as CPUBlockSocketSupport from "@/utils/part/info/CPUBlockSocketSupport";

import { Table } from "../utils/Table";
import { GenericListInputForm } from "../utils/TanstackForm";

function Component({
  form,
}: Readonly<{
  form: ArrayFormApi<CPUBlockSocketSupport.DTO>;
}>) {
  return (
    <form.Field name="items" mode="array">
      {(field) => (
        <Table.Component>
          <Table.Head>
            <Table.Row>
              <Table.Cell>{CPUBlockSocketSupport.Label.socket}</Table.Cell>
            </Table.Row>
          </Table.Head>
          <tbody>
            {(field.state.value ?? []).map((_, index) => (
              <Table.Row key={index}>
                <Table.Cell className="relative">
                  <form.Field name={`items[${index}].socket`}>
                    {(subField) => (
                      <Input
                        name={subField.name}
                        value={subField.state.value}
                        onChange={(e) => subField.handleChange(e.target.value)}
                      />
                    )}
                  </form.Field>
                  <DeleteButton onClick={() => field.removeValue(index)} />
                </Table.Cell>
              </Table.Row>
            ))}
            <Table.Row>
              <Table.Cell>
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => field.pushValue({ socket: "" })}
                >
                  Add
                </Button>
              </Table.Cell>
            </Table.Row>
          </tbody>
        </Table.Component>
      )}
    </form.Field>
  );
}

export default GenericListInputForm(
  Component,
  CPUBlockSocketSupport.Schemas.DTO
);
