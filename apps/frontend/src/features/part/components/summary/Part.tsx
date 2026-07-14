import Part from "@pc-builder/shared/part";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { RowWrapper } from "@/components/ui/FlexWrapper";

import PartPicture from "../Picture";

export const PartColumns: ColumnDef<Part.BasicInfo>[] = [
  {
    id: "name",
    header: () => Part.Label.name,
    cell: ({ row }) => {
      const { slug, name, part, image_url } = row.original;
      return (
        <Link href={`/part/${part}/${slug}`} className="block w-full max-w-full">
          <RowWrapper className="align-middle items-center font-bold lg:max-w-full lg:overflow-hidden lg:truncate">
            <PartPicture part={part} src={image_url ?? undefined} className="h-16 m-2 shrink-0" />
            <span className="lg:truncate">{name}</span>
          </RowWrapper>
        </Link>
      );
    },
    meta: {
      className: "col-span-2 lg:w-1/3 lg:min-w-72 lg:max-w-xs",
    },
  },
  {
    id: "brand",
    header: () => Part.Label.brand,
    cell: ({ row }) => (
      <RowWrapper className="lg:max-w-full lg:overflow-hidden lg:truncate">
        <p className="lg:hidden">Brand:</p>
        {row.original.brand}
      </RowWrapper>
    ),
    meta: {
      className: "lg:w-32 lg:min-w-24 lg:max-w-32 lg:truncate",
    },
  },
  {
    id: "series",
    header: () => Part.Label.series,
    cell: ({ row }) => (
      <RowWrapper className="lg:max-w-full lg:overflow-hidden lg:truncate">
        <p className="lg:hidden">Series:</p>
        {row.original.series}
      </RowWrapper>
    ),
    meta: {
      className: "lg:w-36 lg:min-w-28 lg:max-w-36 lg:truncate",
    },
  },
];
