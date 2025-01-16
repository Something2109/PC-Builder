"use client";

import { createContext, useRef, useState } from "react";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { FilterBar } from "@/components/filterbar";
import { Products } from "@/utils/Enum";
import { TableLoader } from "@/components/tableloader";

const OptionContext = createContext<URLSearchParams>(new URLSearchParams());

export default function PartListPage({
  params: { part },
}: {
  params: { part: Products };
}) {
  const [options, setOptions] = useState<URLSearchParams>(
    new URLSearchParams()
  );
  const defaultOptions = useRef<URLSearchParams>(new URLSearchParams());
  defaultOptions.current.append("part", part);

  return (
    <OptionContext.Provider value={options}>
      <ResponsiveWrapper className="w-full">
        <ColumnWrapper className="hidden lg:block lg:w-1/5">
          <FilterBar context={OptionContext} part={part} set={setOptions} />
        </ColumnWrapper>
        <ColumnWrapper className="lg:w-4/5">
          <TableLoader part={part} context={OptionContext} />
        </ColumnWrapper>
      </ResponsiveWrapper>
    </OptionContext.Provider>
  );
}
