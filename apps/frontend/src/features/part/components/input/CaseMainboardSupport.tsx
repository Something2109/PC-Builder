import { FormFactor } from "@pc-builder/shared/interface";
import * as CaseMainboardSupport from "@pc-builder/shared/part/info/CaseMainboardSupport";

import { ArrayFormApi } from "@/type/form";
import { ChoiceInput } from "@/ui/Input";
import { ResponsiveWrapper } from "@/ui/Layout/FlexWrapper";

import { Table } from "../utils/Table";
import { GenericListInputForm } from "../utils/TanstackForm";

function Component({
  form,
}: Readonly<{
  form: ArrayFormApi<CaseMainboardSupport.DTO>;
}>) {
  return (
    <form.Field name="items" mode="array">
      {(field) => {
        const values = field.state.value ?? [];

        const defaultValueObj = values.map((val) => val.form_factor) ?? [];

        const handleToggle = (form_factor: FormFactor.Mainboard, checked: boolean) => {
          if (checked) {
            field.pushValue({ form_factor });
          } else {
            const index = values.findIndex((val) => val.form_factor === form_factor);
            if (index !== -1) {
              field.removeValue(index);
            }
          }
        };

        return (
          <Table.Component>
            <Table.Head>
              <Table.Row>
                <Table.Cell>{CaseMainboardSupport.Label.form_factor}</Table.Cell>
              </Table.Row>
            </Table.Head>
            <tbody>
              <Table.Row>
                <Table.Cell>
                  <ResponsiveWrapper className="flex-wrap gap-x-3 justify-between">
                    {FormFactor.Mainboard.options.map((val) => (
                      <ChoiceInput
                        type="checkbox"
                        key={`mainboard-${val}`}
                        name="form_factor"
                        value={val}
                        checked={defaultValueObj.includes(val)}
                        onChange={(e) => handleToggle(val, e.target.checked)}
                      />
                    ))}
                  </ResponsiveWrapper>
                </Table.Cell>
              </Table.Row>
            </tbody>
          </Table.Component>
        );
      }}
    </form.Field>
  );
}

export default GenericListInputForm(Component, CaseMainboardSupport.Schemas.DTO);
