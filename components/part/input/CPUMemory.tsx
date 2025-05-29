import { useObjectSet } from "../utils/Hook";
import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { Input, OptionSelect } from "@/components/utils/Input";
import { Button, DeleteButton } from "@/components/utils/Button";
import CPUMemory from "@/utils/interface/part/info/CPUMemory";
import { InternalConnectors } from "@/utils/interface/utils";
import { useRef } from "react";

function Component({
  defaultValue,
}: {
  defaultValue?: CPUMemory.Info[] | null;
}) {
  const [formFactors, addConnector, deleteConnector, existConnector] =
    useObjectSet(
      (type: InternalConnectors.RAM | "") => ({
        type,
        speed: 0,
        capacity: 0,
        channel_count: 0,
        bandwidth: 0,
      }),
      (info) => info.type,
      defaultValue
    );

  return (
    <Table.Component>
      <thead>
        <Table.Row>
          <Table.Cell>{CPUMemory.Label.type}</Table.Cell>
          <Table.Cell>{CPUMemory.Label.speed}</Table.Cell>
          <Table.Cell>{CPUMemory.Label.capacity}</Table.Cell>
          <Table.Cell>{CPUMemory.Label.channel_count}</Table.Cell>
          <Table.Cell>{CPUMemory.Label.bandwidth}</Table.Cell>
        </Table.Row>
      </thead>
      <tbody>
        {formFactors.map(([type, value]) => (
          <Table.Row key={`memory-${type}`}>
            <Table.Cell>
              <label>{type}</label>
            </Table.Cell>
            <Table.Cell>
              <Input
                type="number"
                name={`${type}-bus`}
                defaultValue={value.speed}
                onChange={(e) => (value.speed = Number(e.target.value))}
              />
            </Table.Cell>
            <Table.Cell>
              <Input
                type="number"
                name={`${type}-capacity`}
                defaultValue={value.capacity}
                onChange={(e) => (value.capacity = Number(e.target.value))}
              />
            </Table.Cell>
            <Table.Cell>
              <Input
                type="number"
                name={`${type}-channel_count`}
                defaultValue={value.channel_count}
                onChange={(e) => (value.channel_count = Number(e.target.value))}
              />
            </Table.Cell>
            <Table.Cell className="relative">
              <Input
                type="number"
                name={`${type}-bandwidth`}
                defaultValue={value.bandwidth}
                onChange={(e) => (value.bandwidth = Number(e.target.value))}
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
  exist: (name: InternalConnectors.RAM) => boolean;
  add: (value: InternalConnectors.RAM) => void;
}) {
  const ConnectorInput = useRef<HTMLSelectElement>(null);
  const onAdd = () => {
    const form_factor = ConnectorInput.current!.value as InternalConnectors.RAM;

    add(form_factor);
  };

  const options = InternalConnectors.RAM.options.filter((val) => !exist(val));

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

type MappingFormdata = {
  [key in string]: { [key in string]: string | number };
};

function submit(formData: FormData) {
  const raw = formData.entries().reduce((acc, [key, value]) => {
    const [type, attr] = key.split("-");
    if (!acc[type]) acc[type] = { type };

    acc[type][attr] = Number(value);

    return acc;
  }, {} as MappingFormdata);

  return Object.values(raw).map((val) => CPUMemory.Schema.parse(val)!);
}

export default GenericInputField(Component, submit);
