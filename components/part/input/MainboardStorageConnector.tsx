import { useObjectSet } from "../utils/Hook";
import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { Input, OptionSelect } from "@/components/utils/Input";
import { Button, DeleteButton } from "@/components/utils/Button";
import MainboardStorageConnector from "@/utils/interface/part/info/MainboardStorageConnector";
import { InternalConnectors } from "@/utils/interface/utils";
import { useRef } from "react";

function Component({
  defaultValue,
}: {
  defaultValue?: MainboardStorageConnector.Info[] | null;
}) {
  const [formFactors, addConnector, deleteConnector, existConnector] =
    useObjectSet(
      (form_factor: InternalConnectors.Storage | "") => ({
        form_factor,
        count: 0,
      }),
      (info) => info.form_factor,
      defaultValue
    );

  return (
    <Table.Component>
      <thead>
        <Table.Row>
          <Table.Cell>{MainboardStorageConnector.Label.form_factor}</Table.Cell>
          <Table.Cell>{MainboardStorageConnector.Label.count}</Table.Cell>
        </Table.Row>
      </thead>
      <tbody>
        {formFactors.map(([connector, value]) => (
          <Table.Row key={`storage-${connector}`}>
            <Table.Cell>
              <label>{connector}</label>
            </Table.Cell>
            <Table.Cell className="relative">
              <Input
                type="number"
                name={connector}
                defaultValue={value.count}
                onChange={(e) => (value.count = Number(e.target.value))}
              />
              <DeleteButton onClick={() => deleteConnector(value)} />
            </Table.Cell>
          </Table.Row>
        ))}
        <AddRow exist={existConnector} add={addConnector} />
      </tbody>
    </Table.Component>
  );
}

function AddRow({
  exist,
  add,
}: {
  exist: (name: InternalConnectors.Storage) => boolean;
  add: (value: InternalConnectors.Storage) => void;
}) {
  const ConnectorInput = useRef<HTMLSelectElement>(null);
  const onAdd = () => {
    const form_factor = ConnectorInput.current!
      .value as InternalConnectors.Storage;

    add(form_factor);
  };

  const options = InternalConnectors.Storage.Options.filter(
    (val) => !exist(val)
  );

  return (
    options.length > 0 && (
      <Table.Row>
        <Table.Cell>
          <OptionSelect ref={ConnectorInput} options={options} required />
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
    .map(([form_factor, count]) =>
      MainboardStorageConnector.Schema.parse({ form_factor, count })
    )
    .filter((val) => val.count > 0)
    .toArray();
}

export default GenericInputField(Component, submit);
