import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { useObjectSet } from "@/components/hook/part/ObjectSet";
import { Button, DeleteButton } from "@/components/utils/Button";
import { Input, OptionSelect } from "@/components/utils/Input";
import * as CaseHardDriveSupport from "@/utils/part/info/CaseHardDriveSupport";
import { Case } from "@/utils/interface";
import { memo, useRef } from "react";

function MainComponent({
  defaultValue,
}: {
  defaultValue?: CaseHardDriveSupport.DTO[] | null;
}) {
  const groupByPlace = Object.groupBy(defaultValue ?? [], (val) => val.place);

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
        {Case.HardDrivePlace.options.map((side) => (
          <PlaceRow
            key={`drive-${side}`}
            place={side}
            defaultValue={groupByPlace[side]}
          />
        ))}
      </tbody>
    </Table.Component>
  );
}

function PlaceRow({
  place,
  defaultValue,
}: {
  place: Case.HardDrivePlace;
  defaultValue?: CaseHardDriveSupport.DTO[];
}) {
  const [savedInputValues, addName, deleteName, existName] = useObjectSet(
    (form_factor: Case.HardDriveFormFactor) => ({
      place,
      form_factor,
      count: 0,
    }),
    (info) => info.form_factor,
    defaultValue
  );
  const rowSpan = Math.min(
    savedInputValues.length + 2,
    Case.HardDriveFormFactor.options.length + 1
  );

  return (
    <>
      <Table.Row>
        <Table.Cell className="font-bold" rowSpan={rowSpan}>
          {place}
        </Table.Cell>
      </Table.Row>
      {savedInputValues.map(([key, value]) => (
        <Table.Row className="relative" key={`drive-${place}-${key}`}>
          <ValueRow value={value} />
          <Table.Cell>
            <DeleteButton onClick={() => deleteName(value)} />
          </Table.Cell>
        </Table.Row>
      ))}
      <AddRow exist={existName} add={addName} />
    </>
  );
}

const ValueRow = memo(({ value }: { value: CaseHardDriveSupport.DTO }) => (
  <>
    <Table.Cell>
      <label>{value.form_factor}</label>
    </Table.Cell>
    <Table.Cell>
      <Input
        type="number"
        name={`${value.place}___${value.form_factor}`}
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
  exist: (name: Case.HardDriveFormFactor) => boolean;
  add: (value: Case.HardDriveFormFactor) => void;
}) {
  const FormFactorInput = useRef<HTMLSelectElement>(null);
  const onAdd = () => {
    const form_factor = FormFactorInput.current!
      .value as Case.HardDriveFormFactor;

    add(form_factor);
  };
  const options = Case.HardDriveFormFactor.options.filter((val) => !exist(val));

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
      const [place, form_factor] = key.split("___") as [
        Case.Side,
        Case.HardDriveFormFactor
      ];
      const count = Number(value);
      return CaseHardDriveSupport.Schemas.DTO.parse({
        place,
        form_factor,
        count,
      });
    })
    .toArray();
}

export default GenericInputField(MainComponent, submit);
