import { InputRow } from "./utils";
import GPU from "@/utils/interface/part/GPU";
import { TableHTMLAttributes } from "react";

export function GPUFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<GPU.Info>;
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
          type="number"
          name="core_count"
          label="Core Count"
          defaultValue={defaultValue?.core_count}
        />
        <InputRow
          type="number"
          name="execution_unit"
          label="Execution Unit"
          defaultValue={defaultValue?.execution_unit}
        />
        <InputRow
          type="number"
          name="base_frequency"
          label="Base Frequency"
          defaultValue={defaultValue?.base_frequency}
        />
        <InputRow
          type="number"
          name="boost_frequency"
          label="Boost Frequency"
          defaultValue={defaultValue?.boost_frequency}
        />
        <InputRow name="extra_cores" label="Extra Cores" />
        <InputRow
          type="number"
          name="memory_size"
          label="Memory Size"
          defaultValue={defaultValue?.memory_size}
        />
        <InputRow name="memory_type" label="Memory Type" />
        <InputRow
          type="number"
          name="memory_bus"
          label="Memory Bus"
          defaultValue={defaultValue?.memory_bus}
        />
        <InputRow
          type="number"
          name="tdp"
          label="TDP"
          defaultValue={defaultValue?.tdp}
        />
        <InputRow name="features" label="Features" />
      </tbody>
    </table>
  );
}
