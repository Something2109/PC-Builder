import { Input } from "@/components/utils/Input";
import CPU from "@/utils/interface/part/CPU";
import { InputRow, TableRowWrapper } from "./utils";

import { TableHTMLAttributes } from "react";

export function CPUFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<CPU.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <table className="w-full" {...rest}>
      <tbody>
        <InputRow
          name="family"
          label="Family"
          defaultValue={defaultValue?.family}
        />
        <InputRow
          name="socket"
          label="Socket"
          defaultValue={defaultValue?.socket}
        />
        <InputRow
          type="number"
          name="total_cores"
          label="Total Cores"
          defaultValue={defaultValue?.total_cores}
        />
        <InputRow
          type="number"
          name="total_threads"
          label="Total Threads"
          defaultValue={defaultValue?.total_threads}
        />
        <InputRow
          type="number"
          name="base_frequency"
          label="Base Frequency"
          defaultValue={defaultValue?.base_frequency}
        />
        <InputRow
          type="number"
          name="turbo_frequency"
          label="Turbo Frequency"
          defaultValue={defaultValue?.turbo_frequency}
        />
        <TableRowWrapper>
          <label htmlFor="cores">Core Type</label>
          <Input name="cores" id="cores" />
        </TableRowWrapper>
        <InputRow
          type="number"
          name="L2_cache"
          label="L2 Cache"
          defaultValue={defaultValue?.L2_cache}
        />
        <InputRow
          type="number"
          name="L3_cache"
          label="L3 Cache"
          defaultValue={defaultValue?.L3_cache}
        />
        <InputRow
          type="number"
          name="max_memory"
          label="Max Memory Support"
          defaultValue={defaultValue?.max_memory}
        />
        <InputRow
          type="number"
          name="max_memory_channel"
          label="Max Memory Channel Support"
          defaultValue={defaultValue?.max_memory_channel}
        />
        <InputRow
          type="number"
          name="max_memory_bandwidth"
          label="Max Memory Bandwidth"
          defaultValue={defaultValue?.max_memory_bandwidth}
        />
        <InputRow
          type="number"
          name="tdp"
          label="TDP"
          defaultValue={defaultValue?.tdp}
        />
        <InputRow
          name="lithography"
          label="Lithography"
          defaultValue={defaultValue?.lithography}
        />
      </tbody>
    </table>
  );
}
