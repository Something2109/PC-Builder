import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { useObjectSet } from "@/components/hook/part/ObjectSet";
import { Input, UnitInput } from "@/components/utils/Input";
import { Button, DeleteButton } from "@/components/utils/Button";
import useDebounce from "@/components/utils/Debounce";
import * as CPUCoreConfig from "@/utils/part/info/CPUCoreConfig";
import { FrequencyUnits } from "@/utils/Units";
import { memo, useRef } from "react";

function Component({
  defaultValue,
}: Readonly<{
  defaultValue?: CPUCoreConfig.DTO[] | null;
}>) {
  const [savedInputValues, addName, deleteName, _, changeName] = useObjectSet(
    (name: string) => ({
      name,
      base_frequency: 0,
      turbo_frequency: 0,
      count: 0,
    }),
    (info: CPUCoreConfig.DTO) => info.name,
    defaultValue
  );

  const AddInput = useRef<HTMLInputElement>(null);

  return (
    <Table.Component>
      <Table.Head>
        <Table.Row>
          <Table.Cell>{CPUCoreConfig.Label.name}</Table.Cell>
          <Table.Cell>{CPUCoreConfig.Label.count}</Table.Cell>
          <Table.Cell>{CPUCoreConfig.Label.base_frequency}</Table.Cell>
          <Table.Cell>{CPUCoreConfig.Label.turbo_frequency}</Table.Cell>
        </Table.Row>
      </Table.Head>
      <tbody>
        {savedInputValues.map(([key, value]) => (
          <ValueRow
            key={key}
            value={value}
            changeName={changeName}
            deleteName={deleteName}
          />
        ))}
        <Table.Row>
          <Table.Cell>
            <Input ref={AddInput} />
          </Table.Cell>
          <Table.Cell colSpan={3}>
            <Button
              type="button"
              className="w-full p-0 border-0"
              onClick={() => addName(AddInput.current!.value)}
            >
              Add
            </Button>
          </Table.Cell>
        </Table.Row>
      </tbody>
    </Table.Component>
  );
}

type MappingFormdata = {
  [key in string]: { [key in string]: string | number };
};

const UnmemoValueRow = ({
  value,
  changeName,
  deleteName,
}: {
  value: CPUCoreConfig.DTO;
  changeName: (
    value: CPUCoreConfig.DTO,
    info: CPUCoreConfig.DTO
  ) => CPUCoreConfig.DTO;
  deleteName: (value: CPUCoreConfig.DTO) => void;
}) => {
  const onChange = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const info = changeName(value, { name: e.target.value });
    e.target.value = info.name;
  }, 1000);

  const name = value.name;

  return (
    <Table.Row>
      <Table.Cell>
        <Input
          name={`${name}___name`}
          defaultValue={value.name}
          onChange={onChange}
        />
      </Table.Cell>
      <Table.Cell>
        <Input
          type="number"
          name={`${name}___count`}
          defaultValue={value.count ?? 0}
        />
      </Table.Cell>
      <Table.Cell>
        <UnitInput
          Unit={FrequencyUnits}
          name={`${name}___base_frequency`}
          defaultValue={value.base_frequency ?? 0}
          defaultUnit="GHz"
        />
      </Table.Cell>
      <Table.Cell className="relative">
        <UnitInput
          Unit={FrequencyUnits}
          name={`${name}___turbo_frequency`}
          defaultValue={value.turbo_frequency ?? 0}
          defaultUnit="GHz"
        />
        <DeleteButton onClick={() => deleteName(value)} />
      </Table.Cell>
    </Table.Row>
  );
};

const ValueRow = memo(UnmemoValueRow);

function submit(formData: FormData) {
  const raw = formData.entries().reduce((acc, [key, value]) => {
    const [mapping, attr] = key.split("___");
    if (!acc[mapping]) acc[mapping] = {};

    acc[mapping][attr] = attr === "name" ? (value as string) : Number(value);

    return acc;
  }, {} as MappingFormdata);

  return Object.values(raw)
    .map((val) => CPUCoreConfig.Schemas.DTO.parse(val))
    .filter((val) => val.count);
}

export default GenericInputField(Component, submit);
