import { InternalConnectors } from "@/utils/interface";
import * as MainboardPCIe from "@/utils/part/info/MainboardPCIe";

import { Table } from "../utils/Table";

type ControllerPCIeObject = {
  [side in InternalConnectors.PCIe.Controller]?: MainboardPCIe.DTO[];
};

export default function MainboardPCIeDisplay({
  defaultValue,
}: {
  defaultValue: MainboardPCIe.DTO[];
}) {
  const value: ControllerPCIeObject = defaultValue.reduce<ControllerPCIeObject>(
    (acc: ControllerPCIeObject, curr: MainboardPCIe.DTO) => {
      const side = curr.controller;
      if (!acc[side]) acc[side] = [];

      acc[side].push(curr);

      return acc;
    },
    {}
  );

  return (
    <Table.Component>
      <Table.Head>
        <Table.Row>
          <Table.Cell>{MainboardPCIe.Label.controller}</Table.Cell>
          <Table.Cell>{`${MainboardPCIe.Label.version} ${MainboardPCIe.Label.width}`}</Table.Cell>
          <Table.Cell>{MainboardPCIe.Label.count}</Table.Cell>
        </Table.Row>
      </Table.Head>
      <tbody>
        {InternalConnectors.PCIe.Controller.options.map((controller) =>
          value[controller]?.map(({ version, width, count }, index, arr) => (
            <Table.Row key={`pcie-${controller}-${version}-${width}`}>
              {index === 0 && (
                <Table.Cell className="font-bold" rowSpan={arr.length}>
                  {controller}
                </Table.Cell>
              )}
              <Table.Cell>
                {InternalConnectors.PCIe.toString(version, width)}
              </Table.Cell>
              <Table.Cell>{count}</Table.Cell>
            </Table.Row>
          ))
        )}
      </tbody>
    </Table.Component>
  );
}
