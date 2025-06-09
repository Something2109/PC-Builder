import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { useObjectSet } from "@/components/hook/part/ObjectSet";
import { Input, OptionSelect } from "@/components/utils/Input";
import { Button, DeleteButton } from "@/components/utils/Button";
import MainboardPCIe from "@/utils/interface/part/info/MainboardPCIe";
import { InternalConnectors } from "@/utils/interface/utils";
import { useRef } from "react";

function Component({
  defaultValue,
}: {
  defaultValue?: MainboardPCIe.DTO[] | null;
}) {
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
}: {
  controller: InternalConnectors.PCIe.Controller;
  defaultValue?: MainboardPCIe.DTO[];
}) {
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
      {SavedInputValues.map(([key, value], index, arr) => (
        <Table.Row key={`pcie-${controller}-${key}`}>
          {index === 0 && (
            <Table.Cell className="font-bold" rowSpan={arr.length + 1}>
              {controller}
            </Table.Cell>
          )}
          <Table.Cell colSpan={0} className="hidden">
            <Input
              type="hidden"
              name={`${key}___controller`}
              value={value.controller}
            />
          </Table.Cell>
          <Table.Cell>
            <Input name={`${key}___version`} value={value.version} readOnly />
          </Table.Cell>
          <Table.Cell>
            <Input name={`${key}___width`} value={value.width} readOnly />
          </Table.Cell>
          <Table.Cell className="relative">
            <Input
              type="number"
              name={`${key}___count`}
              defaultValue={value.count ?? 0}
              onChange={(e) => (value.count = Number(e.target.value))}
            />
            <DeleteButton onClick={() => deletePCIe(value)} />
          </Table.Cell>
        </Table.Row>
      ))}
      <AddRow add={addPCIe}>
        {SavedInputValues.length === 0 && controller}
      </AddRow>
    </>
  );
}

function AddRow({
  children,
  add,
}: {
  children?: React.ReactNode;
  add: (version: number, width: InternalConnectors.PCIe.Width) => void;
}) {
  const VersionInput = useRef<HTMLInputElement>(null);
  const WidthInput = useRef<HTMLSelectElement>(null);

  const onAdd = () => {
    const version = Number(VersionInput.current!.value);
    const width = WidthInput.current!.value as InternalConnectors.PCIe.Width;

    add(version, width);
  };

  return (
    <Table.Row>
      {children && <Table.Cell className="font-bold">{children}</Table.Cell>}
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

    acc[mapping][attr] = attr === "count" ? Number(value) : value.toString();

    return acc;
  }, {} as MappingFormdata);

  return Object.values(raw)
    .map((val) => MainboardPCIe.Schemas.DTO.parse(val))
    .filter((val) => val.count);
}

export default GenericInputField(Component, submit);
