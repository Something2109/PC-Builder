"use client";

import { TableWrapper, TableRowWrapper } from "../TableWrapper";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { Input } from "@/components/utils/Input";
import Part from "@/utils/interface/info/Parts";
import { Products } from "@/utils/Enum";
import { useState, TableHTMLAttributes, useCallback } from "react";
import { NotificationBar } from "@/components/utils/NotificationBar";
import { Button } from "@/components/utils/Button";

export default function PartForm({
  path,
  part,
  defaultValue,
  ...rest
}: {
  path: string;
  part: Products;
  defaultValue?: Part.BasicInfo;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  let { code_name, url, brand, series, launch_date } = defaultValue ?? {};
  launch_date = new Date(launch_date ?? new Date());

  const [error, setError] = useState<string | null>(null);
  const save = useCallback(
    async (formData: FormData) => {
      const data = Part.Schema.partial().parse(
        Object.fromEntries(formData.entries())
      );
      const body = JSON.stringify(data);

      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!response.ok) {
        setError((await response.json()).message);
      }
    },
    [defaultValue]
  );

  return (
    <form action={save}>
      <ResponsiveWrapper className="w-full">
        <PictureInput
          className="w-full lg:w-1/3"
          part={part}
          defaultValue={defaultValue}
        />

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
          {error ? (
            <NotificationBar
              message={error}
              remove={() => setError(null)}
              alert
            />
          ) : undefined}
          <Button type="submit" className="w-full">
            Save
          </Button>
        </ColumnWrapper>
      </ResponsiveWrapper>
    </form>
  );
}

function PictureInput({
  part,
  className,
  defaultValue,
}: {
  part: Products;
  className?: string;
  defaultValue?: Part.BasicInfo;
}) {
  const [image, setImage] = useState<string | null>(
    defaultValue?.image_url ?? null
  );
  const defaultUrl = `/images/icons/${part}.png`;

  return (
    <ColumnWrapper className={className}>
      <picture className="rounded-lg bg-white aspect-square *:m-auto p-1">
        <img
          src={image ?? defaultUrl}
          alt={part}
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
        defaultValue={defaultValue?.image_url ?? undefined}
        onChange={(e) => setImage(e.target.value)}
      />
    </ColumnWrapper>
  );
}
