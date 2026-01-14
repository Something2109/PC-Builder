import { Table } from "../utils/Table";
import * as CasePSUSupport from "@/utils/part/info/CasePSUSupport";

const CasePSUSupportTable = ({
  defaultValue,
}: {
  defaultValue: CasePSUSupport.DTO[];
}) => (
  <Table.Component>
    <Table.Head>
      <Table.Row>
        <Table.Cell>{CasePSUSupport.Label.psu_support}</Table.Cell>
      </Table.Row>
    </Table.Head>
    <tbody>
      <Table.Row>
        <Table.Cell>
          {defaultValue.map((val) => val.psu_support).join(", ")}
        </Table.Cell>
      </Table.Row>
    </tbody>
  </Table.Component>
);

export default CasePSUSupportTable;
