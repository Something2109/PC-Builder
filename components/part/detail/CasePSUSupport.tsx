import { Table } from "../utils/Table";
import CasePSUSupport from "@/utils/interface/part/info/CasePSUSupport";

export default ({ defaultValue }: { defaultValue: CasePSUSupport.DTO[] }) => (
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
