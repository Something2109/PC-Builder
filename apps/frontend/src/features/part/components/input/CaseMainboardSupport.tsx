import { ResponsiveWrapper } from "@/ui/FlexWrapper";
import { ChoiceInput } from "@/ui/Input";
import { FormFactor } from "@/utils/interface";
import * as CaseMainboardSupport from "@/utils/part/info/CaseMainboardSupport";

import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";

function Component({
  defaultValue,
}: Readonly<{
  defaultValue?: CaseMainboardSupport.DTO[] | null;
}>) {
  const defaultValueObj = defaultValue?.map((val) => val.form_factor) ?? [];

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
                  name={"form_factor"}
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
    .map(([_, form_factor]) =>
      CaseMainboardSupport.Schemas.DTO.parse({ form_factor })
    )
    .toArray();
}

export default GenericInputField(Component, submit);
