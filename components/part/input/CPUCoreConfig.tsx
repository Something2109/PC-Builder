import { DeleteButton } from "../utils/Button";
import { useObjectSet } from "../utils/Hook";
import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { Input, UnitInput } from "@/components/utils/Input";
import { Button } from "@/components/utils/Button";
import useDebounce from "@/components/utils/Debounce";
import CPUCoreConfig from "@/utils/interface/part/info/CPUCoreConfig";
import { FrequencyUnits } from "@/utils/extract/Units";
import { useRef } from "react";

function Component({
  defaultValue,
}: {
  defaultValue?: CPUCoreConfig.Info[] | null;
}) {
  const [savedInputValues, addName, deleteName, _, changeName] = useObjectSet(
    (name: string) => ({
      name,
      base_frequency: 0,
      turbo_frequency: 0,
      count: 0,
    }),
    (info: CPUCoreConfig.Info) => info.name,
    defaultValue
  );

  const AddInput = useRef<HTMLInputElement>(null);

  return (
    <Table.Component>
      <thead>
        <Table.Row>
          <Table.Cell>{CPUCoreConfig.Label.name}</Table.Cell>
          <Table.Cell>{CPUCoreConfig.Label.count}</Table.Cell>
          <Table.Cell>{CPUCoreConfig.Label.base_frequency}</Table.Cell>
          <Table.Cell>{CPUCoreConfig.Label.turbo_frequency}</Table.Cell>
        </Table.Row>
      </thead>
      <tbody>
        {savedInputValues.map(([key, value], index) => {
          const onChange = useDebounce(
            (e: React.ChangeEvent<HTMLInputElement>) => {
              const info = changeName(value, { name: e.target.value });
              e.target.value = info.name;
            },
            1000
          );

          const name = String(new Date().getTime() + index);

          return (
            <Table.Row key={`core-${key}`}>
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
                  defaultValue={value.count}
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
        })}
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

function submit(formData: FormData) {
  const raw = formData.entries().reduce((acc, [key, value]) => {
    const [mapping, attr] = key.split("___");
    if (!acc[mapping]) acc[mapping] = {};

    acc[mapping][attr] = attr !== "name" ? Number(value) : value.toString();

    return acc;
  }, {} as MappingFormdata);

  return Object.values(raw)
    .map((val) => CPUCoreConfig.Schema.parse(val)!)
    .filter((val) => val.count > 0);
}

export default GenericInputField(Component, submit);
