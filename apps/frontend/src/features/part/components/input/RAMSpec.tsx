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

import { GenericSingleInputForm } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<RAMSpec.DTO> = {
  speed: ({ form: _, ...props }) => (
    <UnitInput Unit={TransferSpeedUnit} defaultUnit="MT/s" {...props} />
  ),
  capacity: ({ form: _, ...props }) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="GB" {...props} />
  ),
  voltage: ({ form: _, ...props }) => (
    <SuffixInput suffix="V" type="number" step={0.01} {...props} />
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
  kit: ({ form: _, ...props }) => (
    <SuffixInput suffix="stick(s)" type="number" step={0.01} {...props} />
  ),
  form_factor: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={FormFactor.RAM.options} {...props} />
  ),
  interface: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={InternalConnectors.RAM.options} {...props} />
  ),
};

export default GenericSingleInputForm<RAMSpec.DTO>(
  Components,
  RAMSpec.Label,
  RAMSpec.Schemas.DTO as ZodType<RAMSpec.DTO, RAMSpec.DTO>
);
