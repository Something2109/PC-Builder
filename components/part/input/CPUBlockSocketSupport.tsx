import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { useObjectSet } from "@/components/hook/part/ObjectSet";
import useDebounce from "@/components/utils/Debounce";
import { Input } from "@/components/utils/Input";
import { Button, DeleteButton } from "@/components/utils/Button";
import * as CPUBlockSocketSupport from "@/utils/part/info/CPUBlockSocketSupport";
import { memo } from "react";

function Component({
  defaultValue,
}: {
  defaultValue?: CPUBlockSocketSupport.DTO[] | null;
}) {
  const [socketSet, addName, deleteName, _, changeSocket] = useObjectSet(
    () => ({ socket: "" }),
    (info: CPUBlockSocketSupport.DTO) => info.socket,
    defaultValue
  );

  return (
    <Table.Component>
      <Table.Head>
        <Table.Row>
          <Table.Cell>{CPUBlockSocketSupport.Label.socket}</Table.Cell>
        </Table.Row>
      </Table.Head>
      <tbody>
        {socketSet.map(([key, value]) => (
          <ValueRow
            key={key}
            value={value}
            changeSocket={changeSocket}
            deleteName={deleteName}
          />
        ))}
        <Table.Row>
          <Table.Cell>
            <Button type="button" className="w-full" onClick={addName}>
              Add
            </Button>
          </Table.Cell>
        </Table.Row>
      </tbody>
    </Table.Component>
  );
}

const ValueRow = memo(
  ({
    value,
    changeSocket,
    deleteName,
  }: {
    value: CPUBlockSocketSupport.DTO;
    changeSocket: (
      value: CPUBlockSocketSupport.DTO,
      info: CPUBlockSocketSupport.DTO
    ) => CPUBlockSocketSupport.DTO;
    deleteName: (value: CPUBlockSocketSupport.DTO) => void;
  }) => {
    const onChange = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const info = changeSocket(value, { socket: e.target.value });
      e.target.value = info.socket;
    }, 500);

    return (
      <Table.Row>
        <Table.Cell className="relative">
          <Input
            name="socket"
            defaultValue={value.socket}
            onChange={onChange}
          />
          <DeleteButton onClick={() => deleteName(value)} />
        </Table.Cell>
      </Table.Row>
    );
  }
);

function submit(formData: FormData) {
  return formData
    .entries()
    .filter(([_, value]) => value !== "")
    .map(([_, socket]) => CPUBlockSocketSupport.Schemas.DTO.parse({ socket }))
    .toArray();
}

export default GenericInputField(Component, submit);
