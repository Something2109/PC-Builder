import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { useObjectSet } from "@/components/hook/part/ObjectSet";
import { Input, OptionSelect } from "@/components/utils/Input";
import { Button, DeleteButton } from "@/components/utils/Button";
import * as MainboardStorageConnector from "@/utils/part/info/MainboardStorageConnector";
import { InternalConnectors } from "@/utils/interface";
import { memo, useRef } from "react";

function Component({
  defaultValue,
}: {
  defaultValue?: MainboardStorageConnector.DTO[] | null;
}) {
  const [formFactors, addConnector, deleteConnector, existConnector] =
    useObjectSet(
      (form_factor: InternalConnectors.Storage) => ({
        form_factor,
        count: 0,
      }),
      (info: MainboardStorageConnector.DTO) => info.form_factor,
      defaultValue
    );

  return (
    <Table.Component>
      <Table.Head>
        <Table.Row>
          <Table.Cell>{MainboardStorageConnector.Label.form_factor}</Table.Cell>
          <Table.Cell>{MainboardStorageConnector.Label.count}</Table.Cell>
        </Table.Row>
      </Table.Head>
      <tbody>
        {formFactors.map(([connector, value]) => (
          <ValueRow
            key={connector}
            value={value}
            deleteConnector={deleteConnector}
          />
        ))}
        <AddRow exist={existConnector} add={addConnector} />
      </tbody>
    </Table.Component>
  );
}

const UnmemoValueRow = ({
  value,
  deleteConnector,
}: {
  value: MainboardStorageConnector.DTO;
  deleteConnector: (value: MainboardStorageConnector.DTO) => void;
}) => (
  <Table.Row key={`storage-${value.form_factor}`}>
    <Table.Cell>
      <label>{value.form_factor}</label>
    </Table.Cell>
    <Table.Cell className="relative">
      <Input
        type="number"
        name={value.form_factor}
        defaultValue={value.count ?? 0}
      />
      <DeleteButton onClick={() => deleteConnector(value)} />
    </Table.Cell>
  </Table.Row>
);

const ValueRow = memo(UnmemoValueRow);

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
      MainboardStorageConnector.Schemas.DTO.parse({ form_factor, count })
    )
    .filter((val) => val.count)
    .toArray();
}

export default GenericInputField(Component, submit);
