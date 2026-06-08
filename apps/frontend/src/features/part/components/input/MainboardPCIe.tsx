import { memo, useRef } from "react";

import { useObjectSet } from "@/features/part/hooks/ObjectSet";
import { Button, DeleteButton } from "@/ui/Button";
import { Input, OptionSelect } from "@/ui/Input";
import { InternalConnectors } from "@/utils/interface";
import * as MainboardPCIe from "@/utils/part/info/MainboardPCIe";

import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";

function Component({
  defaultValue,
}: Readonly<{
  defaultValue?: MainboardPCIe.DTO[] | null;
}>) {
  const groupByController = Object.groupBy(
    defaultValue ?? [],
    (val) => val.controller
  );

  return (
    <Table.Component>
      <Table.Head>
        <Table.Row>
          <Table.Cell>{MainboardPCIe.Label.controller}</Table.Cell>
          <Table.Cell>{MainboardPCIe.Label.version}</Table.Cell>
          <Table.Cell>{MainboardPCIe.Label.width}</Table.Cell>
          <Table.Cell>{MainboardPCIe.Label.count}</Table.Cell>
        </Table.Row>
      </Table.Head>
      <tbody>
        {InternalConnectors.PCIe.Controller.options.map((controller) => (
          <ControllerRow
            key={`drive-${controller}`}
            controller={controller}
            defaultValue={groupByController[controller]}
          />
        ))}
      </tbody>
    </Table.Component>
  );
}

function ControllerRow({
  controller,
  defaultValue,
}: Readonly<{
  controller: InternalConnectors.PCIe.Controller;
  defaultValue?: MainboardPCIe.DTO[];
}>) {
  const [SavedInputValues, addPCIe, deletePCIe] = useObjectSet(
    (version: number, width: InternalConnectors.PCIe.Width) => ({
      controller,
      version,
      width,
      count: 0,
    }),
    (info: MainboardPCIe.DTO) =>
      `${controller} ${InternalConnectors.PCIe.toString(
        info.version,
        info.width
      )}`,
    defaultValue
  );

  return (
    <>
      <Table.Row>
        <Table.Cell className="font-bold" rowSpan={SavedInputValues.length + 2}>
          {controller}
        </Table.Cell>
      </Table.Row>
      {SavedInputValues.map(([key, value]) => (
        <Table.Row className="relative" key={`pcie-${controller}-${key}`}>
          <ValueRow value={value} />
          <Table.Cell>
            <DeleteButton onClick={() => deletePCIe(value)} />
          </Table.Cell>
        </Table.Row>
      ))}
      <AddRow add={addPCIe} />
    </>
  );
}

const UnmemoValueRow = ({ value }: { value: MainboardPCIe.DTO }) => (
  <>
    <Table.Cell colSpan={0} className="hidden">
      <Input
        type="hidden"
        name={`${value.controller}___controller`}
        value={value.controller}
      />
    </Table.Cell>
    <Table.Cell>
      <Input
        name={`${value.controller}___version`}
        value={value.version}
        readOnly
      />
    </Table.Cell>
    <Table.Cell>
      <Input
        name={`${value.controller}___width`}
        value={value.width}
        readOnly
      />
    </Table.Cell>
    <Table.Cell>
      <Input
        type="number"
        name={`${value.controller}___count`}
        defaultValue={value.count ?? 0}
      />
    </Table.Cell>
  </>
);

const ValueRow = memo(UnmemoValueRow);

function AddRow({
  add,
}: Readonly<{
  add: (version: number, width: InternalConnectors.PCIe.Width) => void;
}>) {
  const VersionInput = useRef<HTMLInputElement>(null);
  const WidthInput = useRef<HTMLSelectElement>(null);

  const onAdd = () => {
    const version = Number(VersionInput.current!.value);
    const width = WidthInput.current!.value as InternalConnectors.PCIe.Width;

    add(version, width);
  };

  return (
    <Table.Row>
      <Table.Cell>
        <Input ref={VersionInput} type="number" defaultValue={0} />
      </Table.Cell>
      <Table.Cell>
        <OptionSelect
          ref={WidthInput}
          options={InternalConnectors.PCIe.Width.options}
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
    .map((val) => MainboardPCIe.Schemas.DTO.parse(val))
    .filter((val) => val.count);
}

export default GenericInputField(Component, submit);
