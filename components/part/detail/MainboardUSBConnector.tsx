import { ExternalPorts } from "@/utils/interface";
import { Table } from "../utils/Table";
import * as MainboardUSBConnector from "@/utils/part/info/MainboardUSBConnector";

const MainboardUSBConnectorTable = ({
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

export default MainboardUSBConnectorTable;
