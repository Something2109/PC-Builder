import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { useObjectSet } from "@/components/hook/part/ObjectSet";
import { Input, OptionSelect } from "@/components/utils/Input";
import { DeleteButton } from "@/components/utils/Button";
import * as PSUConnector from "@/utils/part/info/PSUConnector";
import { InternalConnectors } from "@/utils/interface";
import { memo } from "react";

function Component({
  defaultValue,
}: Readonly<{
  defaultValue?: PSUConnector.DTO[] | null;
}>) {
  const [formFactors, addConnector, deleteConnector, existConnector] =
    useObjectSet(
      (type: InternalConnectors.Power) => ({ type, count: 0 }),
      (info: PSUConnector.DTO) => info.type,
      defaultValue
    );

  return (
    <Table.Component>
      <Table.Head>
        <Table.Row>
          <Table.Cell>{PSUConnector.Label.type}</Table.Cell>
          <Table.Cell>{PSUConnector.Label.count}</Table.Cell>
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
        <Table.Row>
          <Table.Cell colSpan={2}>
            <label htmlFor="form_factor">Add: </label>
            <OptionSelect
              id="form_factor"
              options={InternalConnectors.Power.Options.filter(
                (val) => !existConnector(val)
              )}
              onChange={(e) =>
                addConnector(e.target.value as InternalConnectors.Power)
              }
            />
          </Table.Cell>
        </Table.Row>
      </tbody>
    </Table.Component>
  );
}

const UnmemoValueRow = ({
  value,
  deleteConnector,
}: {
  value: PSUConnector.DTO;
  deleteConnector: (value: PSUConnector.DTO) => void;
}) => (
  <Table.Row>
    <Table.Cell>
      <label>{value.type}</label>
    </Table.Cell>
    <Table.Cell className="relative">
      <Input type="number" name={value.type} defaultValue={value.count ?? 0} />
      <DeleteButton onClick={() => deleteConnector(value)} />
    </Table.Cell>
  </Table.Row>
);

const ValueRow = memo(UnmemoValueRow);

function submit(formData: FormData) {
  return formData
    .entries()
    .map(([type, count]) => PSUConnector.Schemas.DTO.parse({ type, count }))
    .filter((val) => val.count)
    .toArray();
}

export default GenericInputField(Component, submit);
