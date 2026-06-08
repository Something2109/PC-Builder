import { ResponsiveWrapper } from "@/ui/FlexWrapper";
import { ChoiceInput } from "@/ui/Input";
import { FormFactor } from "@/utils/interface";
import * as CasePSUSupport from "@/utils/part/info/CasePSUSupport";

import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";

function Component({
  defaultValue,
}: Readonly<{
  defaultValue?: CasePSUSupport.DTO[] | null;
}>) {
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
    .map(([_, psu_support]) =>
      CasePSUSupport.Schemas.DTO.parse({ psu_support })
    )
    .toArray();
}

export default GenericInputField(Component, submit);
