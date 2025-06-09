import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { useObjectSet } from "@/components/hook/part/ObjectSet";
import { Input, OptionSelect } from "@/components/utils/Input";
import { DeleteButton } from "@/components/utils/Button";
import PSUConnector from "@/utils/interface/part/info/PSUConnector";
import { InternalConnectors } from "@/utils/interface/utils";

function Component({
  defaultValue,
}: {
  defaultValue?: PSUConnector.DTO[] | null;
}) {
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
          <Table.Row key={`connector-${type}`}>
            <Table.Cell>
              <label>{type}</label>
            </Table.Cell>
            <Table.Cell className="relative">
              <Input
                type="number"
                name={type}
                defaultValue={value.count ?? 0}
                onChange={(e) => (value.count = Number(e.target.value))}
              />
              <DeleteButton onClick={() => deleteConnector(value)} />
            </Table.Cell>
          </Table.Row>
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

function submit(formData: FormData) {
  return formData
    .entries()
    .map(([type, count]) => PSUConnector.Schemas.DTO.parse({ type, count }))
    .filter((val) => val.count)
    .toArray();
}

export default GenericInputField(Component, submit);
