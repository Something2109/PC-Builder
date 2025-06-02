import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { useObjectSet } from "@/components/hook/part/ObjectSet";
import { Input, OptionSelect } from "@/components/utils/Input";
import { Button, DeleteButton } from "@/components/utils/Button";
import MainboardFanConnector from "@/utils/interface/part/info/MainboardFanConnector";
import { InternalConnectors } from "@/utils/interface/utils";
import { useRef } from "react";

function Component({
  defaultValue,
}: {
  defaultValue?: MainboardFanConnector.Info[] | null;
}) {
  const [SavedInputValues, addName, deleteName] = useObjectSet(
    (
      connector: InternalConnectors.Fan.Connector,
      type: InternalConnectors.Fan.Type
    ) => ({ connector, type, count: 0 }),
    (info: MainboardFanConnector.Info) =>
      InternalConnectors.Fan.toString(info.connector, info.type),
    defaultValue
  );

  return (
    <Table.Component>
      <thead>
        <Table.Row>
          <Table.Cell>{MainboardFanConnector.Label.type}</Table.Cell>
          <Table.Cell>{MainboardFanConnector.Label.connector}</Table.Cell>
          <Table.Cell>{MainboardFanConnector.Label.count}</Table.Cell>
        </Table.Row>
      </thead>
      <tbody>
        {SavedInputValues.map(([key, value]) => (
          <Table.Row key={`fan-${key}`}>
            <Table.Cell>
              <Input name={`${key}___type`} value={value.type} readOnly />
            </Table.Cell>
            <Table.Cell>
              <Input
                name={`${key}___connector`}
                value={value.connector}
                readOnly
              />
            </Table.Cell>
            <Table.Cell className="relative">
              <Input
                type="number"
                name={`${key}___count`}
                defaultValue={value.count}
                onChange={(e) => (value.count = Number(e.target.value))}
              />
              <DeleteButton onClick={() => deleteName(value)} />
            </Table.Cell>
          </Table.Row>
        ))}
        <AddRow add={addName} />
      </tbody>
    </Table.Component>
  );
}

function AddRow({
  add,
}: {
  add: (
    connector: InternalConnectors.Fan.Connector,
    type: InternalConnectors.Fan.Type
  ) => void;
}) {
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

    acc[mapping][attr] = attr === "count" ? Number(value) : value.toString();

    return acc;
  }, {} as MappingFormdata);

  return Object.values(raw)
    .map((val) => MainboardFanConnector.Schema.parse(val)!)
    .filter((val: any) => val.count > 0);
}

export default GenericInputField(Component, submit);
