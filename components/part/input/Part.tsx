"use client";

import { TableWrapper, InputRow } from "../TableWrapper";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { Input } from "@/components/utils/Input";
import Part from "@/utils/interface/part/Parts";
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
        <TableWrapper {...rest}>
          <InputRow
            name="code_name"
            label="Code Name"
            defaultValue={code_name}
            required
          />
          <InputRow
            name="brand"
            label="Brand"
            defaultValue={brand}
            options={["Intel", "AMD"]}
            required
          />
          <InputRow
            name="series"
            label="Series"
            defaultValue={series}
            required
          />
          <InputRow
            type="date"
            name="launch_date"
            label="Launch Date"
            defaultValue={launch_date.toISOString().slice(0, 10)}
            required
          />
          <InputRow
            name="url"
            label="Brand URL"
            defaultValue={url ?? undefined}
            required
          />
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
