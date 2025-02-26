"use client";

import { useState } from "react";
import CPUBlock from "@/utils/interface/info/CPUBlock";
import { InternalConnectors, Material } from "@/utils/interface/utils";
import { Input, OptionSelect } from "@/components/utils/Input";
import { Button } from "@/components/utils/Button";
import { ResponsiveWrapper, RowWrapper } from "@/components/utils/FlexWrapper";
import { GenericInputTable, InfoInputMapping } from "../TableWrapper";

const Components: InfoInputMapping<CPUBlock.Info> = {
  socket: ({ defaultValue, ...props }) => {
    const [value, setValue] = useState<string[]>(defaultValue ?? []);

    return (
      <ResponsiveWrapper className="flex-wrap gap-x-3">
        {value.map((val, index) => (
          <RowWrapper className="w-full" key={`${props.name}-${index}`}>
            <Input {...props} className="w-full" defaultValue={val} />
            <Button
              type="button"
              onClick={() => setValue(value.filter((_, i) => i !== index))}
            >
              Delete
            </Button>
          </RowWrapper>
        ))}
        <Button
          type="button"
          className="w-full"
          onClick={() => setValue([...value, ""])}
        >
          Add
        </Button>
      </ResponsiveWrapper>
    );
  },
  plate: (props) => (
    <OptionSelect options={Material.Metal.options} {...props} />
  ),
  rgb: (props) => (
    <OptionSelect options={InternalConnectors.RGB.options} {...props} />
  ),
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries()) as Record<
    string,
    string | string[]
  >;

  raw.socket = (formData.getAll("socket") as string[]).filter(
    (val) => val.length > 0
  );

  return CPUBlock.Schema.partial().parse(raw);
}

export default GenericInputTable(Components, CPUBlock.Label, submit);
