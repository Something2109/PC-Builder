import { ArrayFormApi } from "@/type/form";
import { ResponsiveWrapper } from "@/ui/FlexWrapper";
import { ChoiceInput } from "@/ui/Input";
import { FormFactor } from "@pc-builder/shared/interface";
import * as CasePSUSupport from "@pc-builder/shared/part/info/CasePSUSupport";

import { Table } from "../utils/Table";
import { GenericListInputForm } from "../utils/TanstackForm";

function Component({
  form,
}: Readonly<{
  form: ArrayFormApi<CasePSUSupport.DTO>;
}>) {
  return (
    <form.Field name="items" mode="array">
      {(field) => {
        const values = field.state.value ?? [];

        const defaultValueObj = values.map((val) => val.psu_support) ?? [];

        const handleToggle = (psu_support: FormFactor.PSU, checked: boolean) => {
          if (checked) {
            field.pushValue({ psu_support });
          } else {
            const index = values.findIndex((val) => val.psu_support === psu_support);
            if (index !== -1) {
              field.removeValue(index);
            }
          }
        };

        return (
          <Table.Component>
            <Table.Head>
              <Table.Row>
                <Table.Cell>{CasePSUSupport.Label.psu_support}</Table.Cell>
              </Table.Row>
            </Table.Head>
            <tbody>
              <Table.Row>
                <Table.Cell>
                  <ResponsiveWrapper className="flex-wrap gap-x-3 justify-between">
                    {FormFactor.PSU.options.map((val) => (
                      <ChoiceInput
                        type="checkbox"
                        key={`psu-${val}`}
                        name="psu_support"
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

export default GenericListInputForm(Component, CasePSUSupport.Schemas.DTO);
