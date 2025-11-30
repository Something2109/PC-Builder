import { PortInputFields } from "../utils/Input";
import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { useObjectSet } from "@/components/hook/part/ObjectSet";
import { Input, OptionSelect } from "@/components/utils/Input";
import { Button, DeleteButton } from "@/components/utils/Button";
import * as GraphicCardPort from "@/utils/part/info/GraphicCardPort";
import { ExternalPorts } from "@/utils/interface";
import { memo, useRef, useState } from "react";

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
      <Table.Head>
        <Table.Row>
          <Table.Cell>{GraphicCardPort.Label.type}</Table.Cell>
          <Table.Cell>{GraphicCardPort.Label.name}</Table.Cell>
          <Table.Cell>{GraphicCardPort.Label.count}</Table.Cell>
        </Table.Row>
      </Table.Head>
      <tbody>
        {Object.values(groupByType).map((value) =>
          value.map(([key, value], index, arr) => (
            <Table.Row key={`port-${key}`}>
              {index === 0 && (
                <Table.Cell className="font-bold" rowSpan={arr.length}>
                  {value.type}
                </Table.Cell>
              )}
              <ValueRow value={value} deleteName={deleteName} />
            </Table.Row>
          ))
        )}
        <AddRow add={addName} />
      </tbody>
    </Table.Component>
  );
}

const ValueRow = memo(function ({
  value,
  deleteName,
}: {
  value: GraphicCardPort.DTO;
  deleteName: (value: GraphicCardPort.DTO) => void;
}) {
  return (
    <>
      <Table.Cell>
        <Input name={`${value.name}___name`} value={value.name} readOnly />
      </Table.Cell>
      <Table.Cell className="relative">
        <Input type="hidden" name={`${value.name}___type`} value={value.type} />
        <Input
          type="number"
          name={`${value.name}___count`}
          defaultValue={value.count ?? 0}
          onChange={(e) => (value.count = Number(e.target.value))}
        />
        <DeleteButton onClick={() => deleteName(value)} />
      </Table.Cell>
    </>
  );
});

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
