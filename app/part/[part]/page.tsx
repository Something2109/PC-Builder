import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { FilterBar } from "@/components/filterbar";
import { Products } from "@/utils/Enum";
import { TableLoader } from "@/components/tableloader";

export default function PartListPage({
  params: { part },
  searchParams,
}: {
  params: { part: Products };
  searchParams: Record<string, string | string[]>;
}) {
  const options = Object.entries(searchParams).reduce((acc, [key, value]) => {
    if (key === "part") {
      acc.push([key, part]);
    } else {
      Array.isArray(value)
        ? value.forEach((v) => acc.push([key, v]))
        : acc.push([key, value]);
    }

    return acc;
  }, [] as string[][]);

  return (
    <ResponsiveWrapper className="w-full">
      <ColumnWrapper className="hidden lg:block lg:w-1/5">
        <FilterBar context={options} part={part} />
      </ColumnWrapper>
      <ColumnWrapper className="lg:w-4/5">
        <TableLoader context={options} part={part} />
      </ColumnWrapper>
    </ResponsiveWrapper>
  );
}
