import { PortInputFields } from "../utils/Input";
import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { useObjectSet } from "@/components/hook/part/ObjectSet";
import { Input, OptionSelect } from "@/components/utils/Input";
import { Button, DeleteButton } from "@/components/utils/Button";
import GraphicCardPort from "@/utils/interface/part/info/GraphicCardPort";
import { ExternalPorts } from "@/utils/interface/utils";
import { useRef, useState } from "react";

function Component({
  defaultValue,
}: {
  defaultValue?: GraphicCardPort.DTO[] | null;
}) {
  const [SavedInputValues, addName, deleteName] = useObjectSet(
    (type: ExternalPorts.Display.Type, name: ExternalPorts.Display) => ({
      type,
      name,
      count: 0,
    }),
    (info: GraphicCardPort.DTO) => info.name,
    defaultValue
  );
  const groupByType = Object.groupBy(
    SavedInputValues,
    ([_, info]) => info.type
  );

  return (
    <Table.Component>
      <thead>
        <Table.Row>
          <Table.Cell>{GraphicCardPort.Label.type}</Table.Cell>
          <Table.Cell>{GraphicCardPort.Label.name}</Table.Cell>
          <Table.Cell>{GraphicCardPort.Label.count}</Table.Cell>
        </Table.Row>
      </thead>
      <tbody>
        {Object.values(groupByType).map((value) =>
          value.map(([key, value], index, arr) => (
            <Table.Row key={`port-${key}`}>
              {index === 0 && (
                <Table.Cell rowSpan={arr.length}>{value.type}</Table.Cell>
              )}
              <Table.Cell>
                <Input name={`${key}___name`} value={value.name} readOnly />
                <Input
                  type="hidden"
                  name={`${key}___type`}
                  value={value.type}
                />
              </Table.Cell>
              <Table.Cell className="relative">
                <Input
                  type="number"
                  name={`${key}___count`}
                  defaultValue={value.count ?? 0}
                  onChange={(e) => (value.count = Number(e.target.value))}
                />
                <DeleteButton onClick={() => deleteName(value)} />
              </Table.Cell>
            </Table.Row>
          ))
        )}
        <AddRow add={addName} />
      </tbody>
    </Table.Component>
  );
}

function AddRow({
  add,
}: {
  add: (type: ExternalPorts.Display.Type, name: ExternalPorts.Display) => void;
}) {
  const NameInput = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<ExternalPorts.Display.Type>(
    ExternalPorts.Display.Type.options[0]
  );
  const Component = PortInputFields[type];

  return (
    <Table.Row>
      <Table.Cell>
        <OptionSelect
          options={ExternalPorts.Display.Type.options}
          value={type}
          onChange={(e) =>
            setType(e.target.value as ExternalPorts.Display.Type)
          }
          required
        />
      </Table.Cell>
      <Table.Cell>
        <Component ref={NameInput} />
      </Table.Cell>
      <Table.Cell>
        <Button
          type="button"
          className="w-full p-0 border-0"
          onClick={() =>
            add(type, NameInput.current!.value as ExternalPorts.Display)
          }
        >
          Add
        </Button>
      </Table.Cell>
    </Table.Row>
  );
}

type MappingFormdata = {
  [key in string]: { [key in string]: string | number };
};

function submit(formData: FormData) {
  const raw = formData.entries().reduce((acc, [key, value]) => {
    const [mapping, attr] = key.split("___");
    if (!acc[mapping]) acc[mapping] = {};

    acc[mapping][attr] = attr === "count" ? Number(value) : value.toString();

    return acc;
  }, {} as MappingFormdata);

  return Object.values(raw)
    .map((val) => GraphicCardPort.Schemas.DTO.parse(val))
    .filter((val: any) => val.count);
}

export default GenericInputField(Component, submit);
