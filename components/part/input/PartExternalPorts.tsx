import { PortInputFields } from "../utils/Input";
import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { useObjectSet } from "@/components/hook/part/ObjectSet";
import { Input, OptionSelect } from "@/components/utils/Input";
import { Button, DeleteButton } from "@/components/utils/Button";
import * as PartExternalPorts from "@/utils/part/info/PartExternalPorts";
import { ExternalPorts } from "@/utils/interface";
import { memo, useRef, useState } from "react";

function Component({
  defaultValue,
}: {
  defaultValue?: PartExternalPorts.DTO[] | null;
}) {
  const [SavedInputValues, addName, deleteName] = useObjectSet(
    (type: ExternalPorts.Type, name: ExternalPorts) => ({
      type,
      name,
      count: 0,
    }),
    (info: PartExternalPorts.DTO) => `${info.type} ${info.name}`,
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
          <Table.Cell>{PartExternalPorts.Label.type}</Table.Cell>
          <Table.Cell>{PartExternalPorts.Label.name}</Table.Cell>
          <Table.Cell>{PartExternalPorts.Label.count}</Table.Cell>
        </Table.Row>
      </Table.Head>
      <tbody>
        {ExternalPorts.Type.options.map((type) => (
          <PortTypeInputField
            key={`port-${type}`}
            defaultValue={groupByType[type]}
            onDelete={deleteName}
          />
        ))}
        <AddRow add={addName} />
      </tbody>
    </Table.Component>
  );
}

const PortTypes = {
  Network: ExternalPorts.Network.Type.options,
  Peripheral: ExternalPorts.Peripheral.Type.options,
  Display: ExternalPorts.Display.Type.options,
  Audio: ExternalPorts.Audio.Type.options,
  Interaction: ExternalPorts.Interaction.Type.options,
};

function usePortType() {
  const [type, setType] = useState<ExternalPorts.Type>(
    ExternalPorts.Type.options[0]
  );
  const [port, setPort] = useState<(typeof PortTypes)[typeof type][number]>(
    PortTypes[type][0]
  );

  const setToType = (newType: ExternalPorts.Type) => {
    setType(newType);
    setPort(PortTypes[newType][0]);
  };

  const setToPort = (newPort: (typeof PortTypes)[typeof type][number]) => {
    setPort(newPort);
  };

  return [type, port, setToType, setToPort] as const;
}

function AddRow({
  add,
}: {
  add: (type: ExternalPorts.Type, name: ExternalPorts) => void;
}) {
  const NameInput = useRef<HTMLInputElement>(null);
  const [type, port, setType, setPort] = usePortType();

  const Component = PortInputFields[port];

  return (
    <Table.Row>
      <Table.Cell>
        <OptionSelect
          options={ExternalPorts.Type.options}
          value={type}
          onChange={(e) => setType(e.target.value as ExternalPorts.Type)}
          required
        />
        <OptionSelect
          options={PortTypes[type]}
          value={port}
          onChange={(e) =>
            setPort(e.target.value as (typeof PortTypes)[typeof type][number])
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

function PortTypeInputField({
  defaultValue,
  onDelete,
}: {
  defaultValue?: [string, PartExternalPorts.DTO][];
  onDelete: (info: PartExternalPorts.DTO) => void;
}) {
  return defaultValue?.map(([key, value], index, arr) => (
    <Table.Row key={`external-${key}`}>
      {index === 0 && (
        <Table.Cell className="font-bold" rowSpan={arr.length}>
          {value.type}
        </Table.Cell>
      )}
      <ValueRow value={value} deleteName={onDelete} />
    </Table.Row>
  ));
}

const ValueRow = memo(function ({
  value,
  deleteName: onDelete,
}: {
  value: PartExternalPorts.DTO;
  deleteName: (value: PartExternalPorts.DTO) => void;
}) {
  const key = `${value.type} ${value.name}`;

  return (
    <>
      <Table.Cell>
        <Input name={`${key}___name`} value={value.name} readOnly />
        <Input type="hidden" name={`${key}___type`} value={value.type} />
      </Table.Cell>
      <Table.Cell className="relative">
        <Input
          type="number"
          name={`${key}___count`}
          defaultValue={value.count ?? 0}
          onChange={(e) => (value.count = Number(e.target.value))}
        />
        <DeleteButton onClick={() => onDelete(value)} />
      </Table.Cell>
    </>
  );
});

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
    .map((val) => PartExternalPorts.Schemas.DTO.parse(val))
    .filter((val: any) => val.count);
}

export default GenericInputField(Component, submit);
