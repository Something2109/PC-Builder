import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { useObjectSet } from "@/components/hook/part/ObjectSet";
import { Input, OptionSelect } from "@/components/utils/Input";
import { Button, DeleteButton } from "@/components/utils/Button";
import * as MainboardUSBConnector from "@/utils/part/info/MainboardUSBConnector";
import { ExternalPorts } from "@/utils/interface";
import { memo, useRef } from "react";

function Component({
  defaultValue,
}: {
  defaultValue?: MainboardUSBConnector.DTO[] | null;
}) {
  const [SavedInputValues, addName, deleteName] = useObjectSet(
    (
      generation: ExternalPorts.Peripheral.USB.Generation,
      connector: ExternalPorts.Peripheral.USB.Connector
    ) => ({
      generation,
      connector,
      count: 0,
    }),
    (info) =>
      ExternalPorts.Peripheral.USB.toString(info.generation, info.connector),
    defaultValue
  );

  return (
    <Table.Component>
      <Table.Head>
        <Table.Row>
          <Table.Cell>{MainboardUSBConnector.Label.generation}</Table.Cell>
          <Table.Cell>{MainboardUSBConnector.Label.connector}</Table.Cell>
          <Table.Cell>{MainboardUSBConnector.Label.count}</Table.Cell>
        </Table.Row>
      </Table.Head>
      <tbody>
        {SavedInputValues.map(([key, value]) => (
          <ValueRow key={key} value={value} deleteName={deleteName} />
        ))}
        <AddRow add={addName} />
      </tbody>
    </Table.Component>
  );
}

const ValueRow = memo(function ({
  value,
  deleteName,
}: {
  value: MainboardUSBConnector.DTO;
  deleteName: (value: MainboardUSBConnector.DTO) => void;
}) {
  const key = ExternalPorts.Peripheral.USB.toString(
    value.generation,
    value.connector
  );

  return (
    <Table.Row key={`usb-${key}`}>
      <Table.Cell>
        <Input name={`${key}___generation`} value={value.generation} readOnly />
      </Table.Cell>
      <Table.Cell>
        <Input name={`${key}___connector`} value={value.connector} readOnly />
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
  );
});

function AddRow({
  add,
}: {
  add: (
    generation: ExternalPorts.Peripheral.USB.Generation,
    connector: ExternalPorts.Peripheral.USB.Connector
  ) => void;
}) {
  const GenerationInput = useRef<HTMLSelectElement>(null);
  const ConnectorInput = useRef<HTMLSelectElement>(null);

  const onAdd = () => {
    const generation = GenerationInput.current!
      .value as ExternalPorts.Peripheral.USB.Generation;
    const connector = ConnectorInput.current!
      .value as ExternalPorts.Peripheral.USB.Connector;

    add(generation, connector);
  };

  return (
    <Table.Row>
      <Table.Cell>
        <OptionSelect
          ref={GenerationInput}
          options={ExternalPorts.Peripheral.USB.Generation.options}
          required
        />
      </Table.Cell>
      <Table.Cell>
        <OptionSelect
          ref={ConnectorInput}
          options={ExternalPorts.Peripheral.USB.Connector.options}
          required
        />
      </Table.Cell>
      <Table.Cell>
        <Button type="button" className="w-full p-0 border-0" onClick={onAdd}>
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
    .map((val) => MainboardUSBConnector.Schemas.DTO.parse(val))
    .filter((val: any) => val.count);
}

export default GenericInputField(Component, submit);
