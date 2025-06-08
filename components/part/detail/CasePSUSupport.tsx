import { Table } from "../utils/Table";
import CasePSUSupport from "@/utils/interface/part/info/CasePSUSupport";

export default ({ defaultValue }: { defaultValue: CasePSUSupport.DTO[] }) => (
  <Table.Component>
    <thead>
      <Table.Row>
        <Table.Cell>{CasePSUSupport.Label.psu_support}</Table.Cell>
      </Table.Row>
    </thead>
    <tbody>
      <Table.Row>
        <Table.Cell>
          {defaultValue.map((val) => val.psu_support).join(", ")}
        </Table.Cell>
      </Table.Row>
    </tbody>
  </Table.Component>
);
