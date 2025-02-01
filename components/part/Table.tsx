import { RowWrapper } from "../utils/FlexWrapper";
import PartPicture from "./Picture";
import { TableWrapper } from "./TableWrapper";
import { CPUComponents } from "./detail/CPU";
import { GPUComponents } from "./detail/GPU";
import { GraphicCardComponents } from "./detail/GraphicCard";
import { MainboardComponents } from "./detail/Mainboard";
import { RANComponents } from "./detail/RAM";
import { HDDComponents } from "./detail/HDD";
import { PSUComponents } from "./detail/PSU";
import { CaseComponents } from "./detail/Case";
import { CoolerComponents } from "./detail/Cooler";
import { AIOComponents } from "./detail/AIO";
import { FanComponents } from "./detail/Fan";
import { SSDComponents } from "./detail/SSD";
import { CPUBlockComponents } from "./detail/CPUBlock";
import { PumpComponents } from "./detail/Pump";
import { RadiatorComponents } from "./detail/Radiator";
import { FunctionComponent, TableHTMLAttributes } from "react";
import { SummaryInfo } from "@/utils/interface";
import { Products, Info } from "@/utils/Enum";

const table = "border-separate border-spacing-0";
const tableHeader =
  "font-bold sticky top-32 bg-white dark:bg-background transition-colors ease-in-out duration-500 delay-0";
const tableRow = "*:p-2 lg:table-row *:lg:border-b-2 ";
const label = "lg:hidden";

export default function PartTable({
  data,
  className,
  ...rest
}: { data: SummaryInfo[] } & TableHTMLAttributes<HTMLTableElement>) {
  let keys: { [key in Products]?: string[] } = {};
  const { id, part, name, brand, series, image_url, ...detail } = data[0];
  Object.entries(detail).forEach(
    ([key, value]) => (keys[key as Products] = Object.keys(value ?? {}))
  );

  return (
    <table className={className?.concat(" ", table) ?? table} {...rest}>
      <thead className={tableHeader}>
        <tr className={`hidden ${tableRow}`}>
          <td>Name</td>
          <td>Brand</td>
          <td>Series</td>
          {Object.values(keys).map((attrs: string[]) =>
            attrs.map((attr) => <td key={`table-header-${attr}`}>{attr}</td>)
          )}
        </tr>
      </thead>
      <tbody>
        {data.map(({ id, part, name, brand, series, image_url, ...detail }) => (
          <tr
            key={id}
            className={`grid grid-cols-2 border-b-2 ${tableRow} hover:rounded-lg hover:bg-line hover:dark:text-background`}
          >
            <td className="col-span-2">
              <a href={`/part/${part}/${id}`}>
                <RowWrapper className="align-middle items-center font-bold">
                  <PartPicture
                    part={{ image_url, part, name }}
                    className="h-16 m-2"
                  />
                  {name}
                </RowWrapper>
              </a>
            </td>
            <td>
              <RowWrapper>
                <p className={label}>Brand:</p>
                {brand}
              </RowWrapper>
            </td>
            <td>
              <RowWrapper>
                <p className={label}>Series:</p>
                {series}
              </RowWrapper>
            </td>
            {Object.entries(keys).map(([key, attrs]) =>
              attrs.map((attr) => (
                <td key={`table-body-${id}-${key}-${attr}`}>
                  <RowWrapper>
                    <p className={label}>{`${attr}:`}</p>
                    {(detail[key as Products] as Record<string, any>)[attr]}
                  </RowWrapper>
                </td>
              ))
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function genericTable<T extends Record<string, any>>(Components: {
  [key in keyof T]: FunctionComponent<{ value: T[key] }>;
}) {
  return ({
    defaultValue,
    ...rest
  }: {
    defaultValue?: Partial<T>;
  } & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) => (
    <TableWrapper {...rest}>
      {Object.entries(defaultValue ?? {}).map(([key, value]) => {
        const Component = Components[key];

        if (!value || !Component) return undefined;

        return <Component value={value as never} />;
      })}
    </TableWrapper>
  );
}

export const DetailTableComponent = {
  [Info.CPU]: genericTable(CPUComponents),
  [Info.GPU]: genericTable(GPUComponents),
  [Info.GRAPHIC_CARD]: genericTable(GraphicCardComponents),
  [Info.MAIN]: genericTable(MainboardComponents),
  [Info.RAM]: genericTable(RANComponents),
  [Info.HDD]: genericTable(HDDComponents),
  [Info.PSU]: genericTable(PSUComponents),
  [Info.CASE]: genericTable(CaseComponents),
  [Info.COOLER]: genericTable(CoolerComponents),
  [Info.AIO]: genericTable(AIOComponents),
  [Info.FAN]: genericTable(FanComponents),
  [Info.SSD]: genericTable(SSDComponents),
  [Info.CPU_BLOCK]: genericTable(CPUBlockComponents),
  [Info.PUMP]: genericTable(PumpComponents),
  [Info.RADIATOR]: genericTable(RadiatorComponents),
};
