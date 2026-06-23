import { Case, FormFactor } from "@pc-builder/shared/interface";
import * as CaseRadiatorSupport from "@pc-builder/shared/part/info/CaseRadiatorSupport";

import { ArrayFormApi } from "@/type/form";
import { ResponsiveWrapper } from "@/ui/FlexWrapper";
import { ChoiceInput } from "@/ui/Input";

import { Table } from "../utils/Table";
import { GenericListInputForm } from "../utils/TanstackForm";

type CaseSideFanObject = { [side in Case.Side]?: FormFactor.Radiator[] };

function Component({
  form,
}: Readonly<{
  form: ArrayFormApi<CaseRadiatorSupport.DTO>;
}>) {
  return (
    <form.Field name="items" mode="array">
      {(field) => {
        const values = field.state.value ?? [];

        const defaultValueObj =
          values.reduce<CaseSideFanObject>((acc: CaseSideFanObject, curr) => {
            const side = curr.case_side;
            if (!acc[side]) acc[side] = [];

            acc[side]!.push(curr.form_factor);

            return acc;
          }, {}) ?? {};

        const handleToggle = (
          case_side: Case.Side,
          form_factor: FormFactor.Radiator,
          checked: boolean
        ) => {
          if (checked) {
            field.pushValue({ case_side, form_factor });
          } else {
            const index = values.findIndex(
              (val) => val.case_side === case_side && val.form_factor === form_factor
            );
            if (index !== -1) {
              field.removeValue(index);
            }
          }
        };

        return (
          <Table.Component>
            <Table.Head>
              <Table.Row>
                <Table.Cell>{CaseRadiatorSupport.Label.case_side}</Table.Cell>
                <Table.Cell>{CaseRadiatorSupport.Label.form_factor}</Table.Cell>
              </Table.Row>
            </Table.Head>
            <tbody>
              {Case.Side.options.map((side) => (
                <Table.Row key={`rad-${side}`}>
                  <Table.Cell className="font-bold">{side}</Table.Cell>
                  <Table.Cell>
                    <ResponsiveWrapper className="flex-wrap gap-x-3 justify-between">
                      {FormFactor.Radiator.options.map((val) => (
                        <ChoiceInput
                          type="checkbox"
                          key={`rad-${side}-${val}`}
                          name={side}
                          value={val}
                          checked={defaultValueObj[side]?.includes(val)}
                          onChange={(e) => handleToggle(side, val, e.target.checked)}
                        />
                      ))}
                    </ResponsiveWrapper>
                  </Table.Cell>
                </Table.Row>
              ))}
            </tbody>
          </Table.Component>
        );
      }}
    </form.Field>
  );
}

export default GenericListInputForm(Component, CaseRadiatorSupport.Schemas.DTO);
