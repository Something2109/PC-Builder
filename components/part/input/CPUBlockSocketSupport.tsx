import { GenericInputField } from "../utils/Form";
import { Table } from "../utils/Table";
import { useObjectSet } from "@/components/hook/part/ObjectSet";
import useDebounce from "@/components/utils/Debounce";
import { Input } from "@/components/utils/Input";
import { Button, DeleteButton } from "@/components/utils/Button";
import CPUBlockSocketSupport from "@/utils/interface/part/info/CPUBlockSocketSupport";

function Component({
  defaultValue,
}: {
  defaultValue?: CPUBlockSocketSupport.Info[] | null;
}) {
  const [socketSet, addName, deleteName, _, changeSocket] = useObjectSet(
    () => ({ socket: "" }),
    (info: CPUBlockSocketSupport.Info) => info.socket,
    defaultValue
  );

  return (
    <Table.Component>
      <thead>
        <Table.Row>
          <Table.Cell>{CPUBlockSocketSupport.Label.socket}</Table.Cell>
        </Table.Row>
      </thead>
      <tbody>
        {socketSet.map(([key, value]) => {
          const onChange = useDebounce(
            (e: React.ChangeEvent<HTMLInputElement>) => {
              const info = changeSocket(value, { socket: e.target.value });
              e.target.value = info.socket;
            },
            500
          );

          return (
            <Table.Row key={`socket-${key}`}>
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
        })}
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

function submit(formData: FormData) {
  return formData
    .entries()
    .filter(([_, value]) => value !== "")
    .map(([_, socket]) => CPUBlockSocketSupport.Schema.parse({ socket })!)
    .toArray();
}

export default GenericInputField(Component, submit);
