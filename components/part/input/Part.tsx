import Part from "@/utils/interface/part/Parts";
import { TableHTMLAttributes } from "react";
import { InputRow } from "./utils";

export function PartFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<Part.BasicInfo>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  let { code_name, url, brand, series, launch_date }: typeof defaultValue =
    defaultValue ?? {};
  launch_date = new Date(launch_date ?? new Date());

  return (
    <table className="w-full" {...rest}>
      <tbody>
        <InputRow
          name="code_name"
          label="Code Name"
          defaultValue={code_name}
          required
        />
        <InputRow
          name="brand"
          label="Brand"
          defaultValue={brand}
          options={["Intel", "AMD"]}
          required
        />
        <InputRow name="series" label="Series" defaultValue={series} required />
        <InputRow
          type="date"
          name="launch_date"
          label="Launch Date"
          defaultValue={launch_date.toISOString().slice(0, 10)}
          required
        />
        <InputRow name="url" label="Brand URL" defaultValue={url} required />
      </tbody>
    </table>
  );
}
