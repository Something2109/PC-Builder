import { ExternalPorts } from "@/utils/interface/utils";
import { Table } from "../utils/Table";
import MainboardUSBConnector from "@/utils/interface/part/info/MainboardUSBConnector";

export default ({
  defaultValue,
}: {
  defaultValue: MainboardUSBConnector.DTO[];
}) => (
  <Table.Component>
    <tbody>
      {defaultValue.map((val) => (
        <Table.Row key={`usb-${val.generation}-${val.connector}`}>
          <Table.Cell>
            {ExternalPorts.Peripheral.USB.toString(
              val.generation,
              val.connector
            )}
          </Table.Cell>
          <Table.Cell>{val.count}</Table.Cell>
        </Table.Row>
      ))}
    </tbody>
  </Table.Component>
);
