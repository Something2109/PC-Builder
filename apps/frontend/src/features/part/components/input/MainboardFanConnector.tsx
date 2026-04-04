import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { useObjectSet } from "@/features/part/hooks/ObjectSet";
import { Input, OptionSelect } from "@/ui/Input";
import { Button, DeleteButton } from "@/ui/Button";
import * as MainboardFanConnector from "@/utils/part/info/MainboardFanConnector";
import { InternalConnectors } from "@/utils/interface";
import { memo, useRef } from "react";

function Component({
  defaultValue,
}: Readonly<{
  defaultValue?: MainboardFanConnector.DTO[] | null;
}>) {
  const [SavedInputValues, addName, deleteName] = useObjectSet(
    (
      connector: InternalConnectors.Fan.Connector,
      type: InternalConnectors.Fan.Type
    ) => ({ connector, type, count: 0 }),
    (info: MainboardFanConnector.DTO) =>
      InternalConnectors.Fan.toString(info.connector, info.type),
    defaultValue
  );

  return (
    <Table.Component>
      <Table.Head>
        <Table.Row>
          <Table.Cell>{MainboardFanConnector.Label.type}</Table.Cell>
          <Table.Cell>{MainboardFanConnector.Label.connector}</Table.Cell>
          <Table.Cell>{MainboardFanConnector.Label.count}</Table.Cell>
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

function UnmemoValueRow({
  value,
  deleteName,
}: Readonly<{
  value: MainboardFanConnector.DTO;
  deleteName: (value: MainboardFanConnector.DTO) => void;
}>) {
  const key = InternalConnectors.Fan.toString(value.connector, value.type);

  return (
    <Table.Row>
      <Table.Cell>
        <Input name={`${key}___type`} value={value.type} readOnly />
      </Table.Cell>
      <Table.Cell>
        <Input name={`${key}___connector`} value={value.connector} readOnly />
      </Table.Cell>
      <Table.Cell className="relative">
        <Input
          type="number"
          name={`${key}___count`}
          defaultValue={value.count ?? 0}
        />
        <DeleteButton onClick={() => deleteName(value)} />
      </Table.Cell>
    </Table.Row>
  );
}

const ValueRow = memo(UnmemoValueRow);

function AddRow({
  add,
}: Readonly<{
  add: (
    connector: InternalConnectors.Fan.Connector,
    type: InternalConnectors.Fan.Type
  ) => void;
}>) {
  const ConnectorInput = useRef<HTMLSelectElement>(null);
  const TypeInput = useRef<HTMLSelectElement>(null);

  const onAdd = () => {
    const connector = ConnectorInput.current!
      .value as InternalConnectors.Fan.Connector;
    const type = TypeInput.current!.value as InternalConnectors.Fan.Type;

    add(connector, type);
  };

  return (
    <Table.Row>
      <Table.Cell>
        <OptionSelect
          ref={TypeInput}
          options={InternalConnectors.Fan.Type.options}
          required
        />
      </Table.Cell>
      <Table.Cell>
        <OptionSelect
          ref={ConnectorInput}
          options={InternalConnectors.Fan.Connector.options}
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

    acc[mapping][attr] = attr === "count" ? Number(value) : (value as string);

    return acc;
  }, {} as MappingFormdata);

  return Object.values(raw)
    .map((val) => MainboardFanConnector.Schemas.DTO.parse(val))
    .filter((val) => val.count);
}

export default GenericInputField(Component, submit);
