import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { useObjectSet } from "@/components/hook/part/ObjectSet";
import { Input, OptionSelect } from "@/components/utils/Input";
import { Button, DeleteButton } from "@/components/utils/Button";
import CaseFanSupport from "@/utils/interface/part/info/CaseFanSupport";
import { Case, FormFactor } from "@/utils/interface/utils";
import { memo, useRef } from "react";

function MainComponent({
  defaultValue,
}: {
  defaultValue?: CaseFanSupport.DTO[] | null;
}) {
  const groupBySide = Object.groupBy(
    defaultValue ?? [],
    (val) => val.case_side
  );

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
        {Case.Side.options.map((side) => (
          <SideRow
            key={`drive-${side}`}
            side={side}
            defaultValue={groupBySide[side]}
          />
        ))}
      </tbody>
    </Table.Component>
  );
}

function SideRow({
  side: case_side,
  defaultValue,
}: {
  side: Case.Side;
  defaultValue?: CaseFanSupport.DTO[];
}) {
  const [savedInputValues, addName, deleteName, existName] = useObjectSet(
    (form_factor: FormFactor.Fan) => ({ case_side, form_factor, count: 0 }),
    (info) => info.form_factor,
    defaultValue
  );
  const rowSpan = Math.min(
    savedInputValues.length + 2,
    FormFactor.Fan.options.length + 1
  );

  return (
    <>
      <Table.Row>
        <Table.Cell className="font-bold" rowSpan={rowSpan}>
          {case_side}
        </Table.Cell>
      </Table.Row>
      {savedInputValues.map(([key, val]) => (
        <Table.Row className="relative" key={`fan-${case_side}-${key}`}>
          <ValueRow value={val} />
          <Table.Cell>
            <DeleteButton onClick={() => deleteName(val)} />
          </Table.Cell>
        </Table.Row>
      ))}
      <AddRow exist={existName} add={addName} />
    </>
  );
}

const ValueRow = memo(({ value }: { value: CaseFanSupport.DTO }) => (
  <>
    <Table.Cell>
      <label>{value.form_factor}</label>
    </Table.Cell>
    <Table.Cell>
      <Input
        type="number"
        name={`${value.case_side}___${value.form_factor}`}
        defaultValue={value.count ?? 0}
        onChange={(e) => (value.count = Number(e.target.value))}
      />
    </Table.Cell>
  </>
));

function AddRow({
  exist,
  add,
}: {
  exist: (name: FormFactor.Fan) => boolean;
  add: (value: FormFactor.Fan) => void;
}) {
  const FormFactorInput = useRef<HTMLSelectElement>(null);
  const onAdd = () => {
    const form_factor = FormFactorInput.current!.value as FormFactor.Fan;

    add(form_factor);
  };

  const options = FormFactor.Fan.options.filter((val) => !exist(val));

  return (
    options.length > 0 && (
      <Table.Row>
        <Table.Cell>
          <OptionSelect ref={FormFactorInput} options={options} required />
        </Table.Cell>
        <Table.Cell>
          <Button type="button" className="w-full p-0 border-0" onClick={onAdd}>
            Add
          </Button>
        </Table.Cell>
      </Table.Row>
    )
  );
}

function submit(formData: FormData) {
  return formData
    .entries()
    .filter(([_, value]) => value !== "" || Number(value) !== 0)
    .map(([key, value]) => {
      const [case_side, form_factor] = key.split("___") as [
        Case.Side,
        FormFactor.Fan
      ];
      const count = Number(value);
      return CaseFanSupport.Schemas.DTO.parse({
        case_side,
        form_factor,
        count,
      });
    })
    .toArray();
}

export default GenericInputField(MainComponent, submit);
