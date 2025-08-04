import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { useObjectSet } from "@/components/hook/part/ObjectSet";
import { Input, OptionSelect } from "@/components/utils/Input";
import { Button, DeleteButton } from "@/components/utils/Button";
import MainboardPowerConnector from "@/utils/interface/part/info/MainboardPowerConnector";
import { InternalConnectors } from "@/utils/interface/utils";
import { memo, useRef } from "react";

function Component({
  defaultValue,
}: {
  defaultValue?: MainboardPowerConnector.DTO[] | null;
}) {
  const [formFactors, addConnector, deleteConnector, existConnector] =
    useObjectSet(
      (type: InternalConnectors.Power.Mainboard) => ({ type, count: 0 }),
      (info: MainboardPowerConnector.DTO) => info.type,
      defaultValue
    );

  return (
    <Table.Component>
      <Table.Head>
        <Table.Row>
          <Table.Cell>{MainboardPowerConnector.Label.type}</Table.Cell>
          <Table.Cell>{MainboardPowerConnector.Label.count}</Table.Cell>
        </Table.Row>
      </Table.Head>
      <tbody>
        {formFactors.map(([key, value]) => (
          <ValueRow key={key} value={value} deleteConnector={deleteConnector} />
        ))}
        <AddRow exist={existConnector} add={addConnector} />
      </tbody>
    </Table.Component>
  );
}

const ValueRow = memo(
  ({
    value,
    deleteConnector,
  }: {
    value: MainboardPowerConnector.DTO;
    deleteConnector: (value: MainboardPowerConnector.DTO) => void;
  }) => (
    <Table.Row>
      <Table.Cell>
        <label>{value.type}</label>
      </Table.Cell>
      <Table.Cell className="relative">
        <Input
          type="number"
          name={value.type}
          defaultValue={value.count ?? 0}
          onChange={(e) => (value.count = Number(e.target.value))}
        />
        <DeleteButton onClick={() => deleteConnector(value)} />
      </Table.Cell>
    </Table.Row>
  )
);

function AddRow({
  exist,
  add,
}: {
  exist: (name: InternalConnectors.Power.Mainboard) => boolean;
  add: (value: InternalConnectors.Power.Mainboard) => void;
}) {
  const ConnectorInput = useRef<HTMLSelectElement>(null);
  const onAdd = () => {
    const form_factor = ConnectorInput.current!
      .value as InternalConnectors.Power.Mainboard;

    add(form_factor);
  };

  const options = InternalConnectors.Power.Mainboard.options.filter(
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
    .map(([type, count]) =>
      MainboardPowerConnector.Schemas.DTO.parse({ type, count })
    )
    .filter((val) => val.count)
    .toArray();
}

export default GenericInputField(Component, submit);
