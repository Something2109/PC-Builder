import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { ResponsiveWrapper } from "@/components/utils/FlexWrapper";
import { ChoiceInput } from "@/components/utils/Input";
import CaseRadiatorSupport from "@/utils/interface/part/info/CaseRadiatorSupport";
import { Case, FormFactor } from "@/utils/interface/utils";

type CaseSideFanObject = { [side in Case.Side]?: FormFactor.Radiator[] };

function Component({
  defaultValue,
}: {
  defaultValue?: CaseRadiatorSupport.DTO[] | null;
}) {
  const defaultValueObj =
    defaultValue?.reduce<CaseSideFanObject>(
      (acc: CaseSideFanObject, curr: CaseRadiatorSupport.DTO) => {
        const side = curr.case_side;
        if (!acc[side]) acc[side] = [];

        acc[side].push(curr.form_factor);

        return acc;
      },
      {}
    ) ?? {};

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
            <Table.Cell key={`rad-${side}`}>
              <ResponsiveWrapper className="flex-wrap gap-x-3 justify-between">
                {FormFactor.Radiator.options.map((val) => (
                  <ChoiceInput
                    type="checkbox"
                    key={`rad-${side}-${val}`}
                    name={side}
                    value={val}
                    defaultChecked={defaultValueObj[side]?.includes(val)}
                  />
                ))}
              </ResponsiveWrapper>
            </Table.Cell>
          </Table.Row>
        ))}
      </tbody>
    </Table.Component>
  );
}

function submit(formData: FormData) {
  return formData
    .entries()
    .map(([case_side, form_factor]) =>
      CaseRadiatorSupport.Schemas.DTO.parse({ case_side, form_factor })
    )
    .toArray();
}

export default GenericInputField(Component, submit);
