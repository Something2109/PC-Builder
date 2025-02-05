"use client";

import { TableWrapper, TableRowWrapper } from "../TableWrapper";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { Input } from "@/components/utils/Input";
import Part from "@/utils/interface/info/Parts";
import { useState, TableHTMLAttributes } from "react";

export default function PartFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue: Part.BasicInfo;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  let { code_name, url, brand, series, launch_date } = defaultValue;
  launch_date = new Date(launch_date ?? new Date());

  return (
    <ResponsiveWrapper className="w-full">
      <PictureInput className="w-full lg:w-1/3" part={defaultValue} />

      <ColumnWrapper className="w-full lg:w-2/3 p-5">
        <Input
          name="name"
          placeholder="Name"
          className="text-4xl font-bold"
          defaultValue={defaultValue?.name}
          required
        />
        <TableWrapper>
          <TableRowWrapper>
            <label htmlFor="code_name">{Part.Label.code_name}</label>
            <Input
              name="code_name"
              id="code_name"
              placeholder={Part.Label.code_name}
              defaultValue={code_name}
            />
          </TableRowWrapper>
          <TableRowWrapper>
            <label htmlFor="brand">{Part.Label.brand}</label>
            <Input
              name="brand"
              id="brand"
              placeholder={Part.Label.brand}
              defaultValue={brand}
            />
          </TableRowWrapper>
          <TableRowWrapper>
            <label htmlFor="series">{Part.Label.series}</label>
            <Input
              name="series"
              id="series"
              placeholder={Part.Label.series}
              defaultValue={series}
            />
          </TableRowWrapper>
          <TableRowWrapper>
            <label htmlFor="launch_date">{Part.Label.launch_date}</label>
            <Input
              type="date"
              name="launch_date"
              id="launch_date"
              placeholder={Part.Label.launch_date}
              defaultValue={launch_date.toISOString().slice(0, 10)}
            />
          </TableRowWrapper>
          <TableRowWrapper>
            <label htmlFor="url">{Part.Label.url}</label>
            <Input
              type="url"
              name="url"
              id="url"
              placeholder={Part.Label.url}
              defaultValue={url ?? undefined}
              required
            />
          </TableRowWrapper>
        </TableWrapper>
      </ColumnWrapper>
    </ResponsiveWrapper>
  );
}

function PictureInput({
  part: { image_url, part, name },
  className,
}: {
  part: { image_url?: string | null; part: string; name: string };
  className?: string;
}) {
  const [image, setImage] = useState<string | null>(image_url ?? null);
  const defaultUrl = `/images/icons/${part}.png`;

  return (
    <ColumnWrapper className={className}>
      <picture className="rounded-lg bg-white aspect-square *:m-auto p-1">
        <img
          src={image ?? defaultUrl}
          alt={name}
          className="max-w-full max-h-full size-full"
          onError={({ currentTarget }) => {
            setImage(null);
            currentTarget.src = defaultUrl;
          }}
        />
      </picture>
      <Input
        type="url"
        name="image_url"
        id="image_url"
        placeholder="Image URL"
        defaultValue={image_url ?? undefined}
        onChange={(e) => setImage(e.target.value)}
      />
    </ColumnWrapper>
  );
}
