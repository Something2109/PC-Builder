import { ZodType } from "zod";

import { RowWrapper } from "@/ui/FlexWrapper";
import {
  SuffixInput,
  UnitInput,
  OptionSelect,
  Input,
} from "@/ui/Input";
import { FormFactor, InternalConnectors } from "@/utils/interface";
import * as RAMSpec from "@/utils/part/info/RAMSpec";
import { MemoryUnits, TransferSpeedUnit } from "@/utils/Units";

import { GenericSingleInputForm, mapChange } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<RAMSpec.DTO> = {
  speed: (field) => (
    <UnitInput
      Unit={TransferSpeedUnit}
      defaultUnit="MT/s"
      {...mapChange(field, "number")}
    />
  ),
  capacity: (field) => (
    <UnitInput
      Unit={MemoryUnits}
      defaultUnit="GB"
      {...mapChange(field, "number")}
    />
  ),
  voltage: (field) => (
    <SuffixInput
      suffix="V"
      type="number"
      step={0.01}
      {...mapChange(field, "number")}
    />
  ),
  latency: ({ state, handleChange, handleBlur }) => {
    const arr = Array.isArray(state.value) ? state.value : ["", "", "", ""];
    const handleChangeIdx = (idx: number, val: string) => {
      const next = [...arr];
      next[idx] = val === "" ? "" : Number(val);
      handleChange(next as any);
    };

    return (
      <RowWrapper>
        {[0, 1, 2, 3].map((idx) => (
          <Input
            key={idx}
            type="number"
            className="w-1/5"
            value={arr[idx] ?? ""}
            onBlur={handleBlur}
            onChange={(e) => handleChangeIdx(idx, e.target.value)}
          />
        ))}
      </RowWrapper>
    );
  },
  kit: (field) => (
    <SuffixInput
      suffix="stick(s)"
      type="number"
      step={0.01}
      {...mapChange(field, "number")}
    />
  ),
  form_factor: (field) => (
    <OptionSelect
      options={FormFactor.RAM.options}
      {...mapChange(field, "select")}
    />
  ),
  interface: (field) => (
    <OptionSelect
      options={InternalConnectors.RAM.options}
      {...mapChange(field, "select")}
    />
  ),
};

export default GenericSingleInputForm<RAMSpec.DTO>(
  Components,
  RAMSpec.Label,
  RAMSpec.Schemas.DTO as ZodType<RAMSpec.DTO, RAMSpec.DTO>
);
