import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { useObjectSet } from "@/components/hook/part/ObjectSet";
import { OptionSelect, SuffixInput, UnitInput } from "@/components/utils/Input";
import { Button, DeleteButton } from "@/components/utils/Button";
import * as CPUMemory from "@/utils/part/info/CPUMemory";
import { InternalConnectors } from "@/utils/interface";
import { memo, useRef } from "react";
import { MemorySpeedUnit, MemoryUnits, TransferSpeedUnit } from "@/utils/Units";

function Component({
  defaultValue,
}: {
  defaultValue?: CPUMemory.DTO[] | null;
}) {
  const [formFactors, addConnector, deleteConnector, existConnector] =
    useObjectSet(
      (type: InternalConnectors.RAM) => ({
        type,
        speed: 0,
        capacity: 0,
        channel_count: 0,
        bandwidth: 0,
      }),
      (info: CPUMemory.DTO) => info.type,
      defaultValue
    );

  return (
    <Table.Component>
      <Table.Head>
        <Table.Row>
          <Table.Cell>{CPUMemory.Label.type}</Table.Cell>
          <Table.Cell>{CPUMemory.Label.speed}</Table.Cell>
          <Table.Cell>{CPUMemory.Label.capacity}</Table.Cell>
          <Table.Cell>{CPUMemory.Label.channel_count}</Table.Cell>
          <Table.Cell>{CPUMemory.Label.bandwidth}</Table.Cell>
        </Table.Row>
      </Table.Head>
      <tbody>
        {formFactors.map(([type, value]) => (
          <ValueRow
            key={type}
            value={value}
            deleteConnector={deleteConnector}
          />
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
    value: CPUMemory.DTO;
    deleteConnector: (value: CPUMemory.DTO) => void;
  }) => (
    <Table.Row>
      <Table.Cell>
        <label>{value.type}</label>
      </Table.Cell>
      <Table.Cell>
        <UnitInput
          name={`${value.type}-speed`}
          Unit={TransferSpeedUnit}
          defaultUnit="MT/s"
          defaultValue={value.speed ?? 0}
          onChange={(e) => (value.speed = Number(e.target.value))}
        />
      </Table.Cell>
      <Table.Cell>
        <UnitInput
          name={`${value.type}-capacity`}
          Unit={MemoryUnits}
          defaultUnit="GB"
          defaultValue={value.capacity ?? 0}
          onChange={(e) => (value.capacity = Number(e.target.value))}
        />
      </Table.Cell>
      <Table.Cell>
        <SuffixInput
          type="number"
          name={`${value.type}-channel_count`}
          suffix="channel(s)"
          defaultValue={value.channel_count ?? 0}
          onChange={(e) => (value.channel_count = Number(e.target.value))}
        />
      </Table.Cell>
      <Table.Cell className="relative">
        <UnitInput
          Unit={MemorySpeedUnit}
          defaultUnit="GB/s"
          name={`${value.type}-bandwidth`}
          defaultValue={value.bandwidth ?? 0}
          onChange={(e) => (value.bandwidth = Number(e.target.value))}
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

  return Object.values(raw).map((val) => CPUMemory.Schemas.DTO.parse(val));
}

export default GenericInputField(Component, submit);
