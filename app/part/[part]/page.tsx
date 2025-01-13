"use client";

import { createContext, useRef, useState } from "react";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { FilterBar } from "@/components/filterbar";
import { FilterOptions } from "@/utils/interface";
import { Products } from "@/utils/Enum";
import { TableLoader } from "@/components/tableloader";

const OptionContext = createContext<FilterOptions & { q?: string }>({});

export default function PartListPage({ params }: { params: { part: string } }) {
  const [options, setOptions] = useState<FilterOptions>({
    part: { part: [params.part] },
  });
  const defaultOptions = useRef<FilterOptions>({
    part: { part: [params.part] },
  });

  return (
    <OptionContext.Provider value={options}>
      <ResponsiveWrapper className="w-full">
        <ColumnWrapper className="hidden lg:block lg:w-1/5">
          <FilterBar
            context={OptionContext}
            defaultOptions={defaultOptions.current}
            set={setOptions}
          />
        </ColumnWrapper>
        <ColumnWrapper className="lg:w-4/5">
          <TableLoader part={params.part as Products} context={OptionContext} />
        </ColumnWrapper>
      </ResponsiveWrapper>
    </OptionContext.Provider>
  );
}
