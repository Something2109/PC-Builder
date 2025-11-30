import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { ResponsiveWrapper } from "@/components/utils/FlexWrapper";
import { ChoiceInput } from "@/components/utils/Input";
import * as CasePSUSupport from "@/utils/part/info/CasePSUSupport";
import { FormFactor } from "@/utils/interface";

function Component({
  defaultValue,
}: {
  defaultValue?: CasePSUSupport.DTO[] | null;
}) {
  const defaultValueObj = defaultValue?.map((val) => val.psu_support) ?? [];

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
                  name={"psu_support"}
                  value={val}
                  defaultChecked={defaultValueObj.includes(val)}
                />
              ))}
            </ResponsiveWrapper>
          </Table.Cell>
        </Table.Row>
      </tbody>
    </Table.Component>
  );
}

function submit(formData: FormData) {
  return formData
    .entries()
    .map(([key, psu_support]) =>
      CasePSUSupport.Schemas.DTO.parse({ psu_support })
    )
    .toArray();
}

export default GenericInputField(Component, submit);
