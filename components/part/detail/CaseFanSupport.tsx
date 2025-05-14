import { Table } from "../utils/Table";
import CaseFanSupport from "@/utils/interface/part/info/CaseFanSupport";
import { Case, FormFactor } from "@/utils/interface/utils";

type CaseSideFanObject = {
  [side in Case.Side]?: { [form in FormFactor.Fan]?: number };
};

export default function CaseFanSupportDisplay({
  defaultValue,
}: {
  defaultValue: CaseFanSupport.Info[];
}) {
  const value: CaseSideFanObject = defaultValue.reduce<CaseSideFanObject>(
    (acc: CaseSideFanObject, curr: CaseFanSupport.Info) => {
      const side = curr.case_side;
      if (!acc[side]) acc[side] = {};

      acc[side][curr.form_factor] = curr.count;

      return acc;
    },
    {}
  );

  return (
    <Table.Component>
      <thead>
        <Table.Row>
          <Table.Cell>{CaseFanSupport.Label.case_side}</Table.Cell>
          <Table.Cell>{CaseFanSupport.Label.form_factor}</Table.Cell>
          <Table.Cell>{CaseFanSupport.Label.count}</Table.Cell>
        </Table.Row>
      </thead>
      <tbody>
        {Object.entries(value).map(([side, fanObj], index) =>
          Object.entries(fanObj).map(([form, count], index, fans) => (
            <Table.Row key={`fan-${side}-${form}`}>
              {index === 0 && (
                <Table.Cell rowSpan={fans.length}>{side}</Table.Cell>
              )}
              <Table.Cell>{form}</Table.Cell>
              <Table.Cell>{count}</Table.Cell>
            </Table.Row>
          ))
        )}
      </tbody>
    </Table.Component>
  );
}
