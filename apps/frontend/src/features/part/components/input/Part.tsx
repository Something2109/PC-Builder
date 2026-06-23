"use client";

import Part, { Infos, Products } from "@pc-builder/shared/part";
import { useState } from "react";

import usePartAction from "@/features/part/hooks/PartAction";
import { Button, RedirectButton } from "@/ui/Button";
import { ColumnWrapper, ResponsiveWrapper, RowWrapper } from "@/ui/FlexWrapper";
import { Input, TextArea } from "@/ui/Input";
import { NotificationBar } from "@/ui/NotificationBar";

import PartPicture from "../Picture";
import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<
  Omit<Part.DTO, "id" | "part" | "name" | "image_url" | Infos>
> = {
  code_name: (props) => <Input {...props} />,
  brand: (props) => <Input {...props} />,
  series: (props) => <Input {...props} />,
  url: ({ defaultValue, value: _, ...props }) => (
    <Input defaultValue={defaultValue ?? undefined} {...props} required />
  ),
  launch_date: ({ defaultValue, value: _, ...props }) => (
    <Input
      type="date"
      defaultValue={new Date(defaultValue ?? new Date()).toISOString().slice(0, 10)}
      {...props}
    />
  ),
};

const PartInput = InfoComponent(Components, Part.Label);

export default function PartForm({
  path,
  part,
  defaultValue,
}: Readonly<{
  path: string;
  part: Products;
  defaultValue?: Part.DTO;
}>) {
  const [formValue, save, pending, error, setError] = usePartAction(path, defaultValue);

  const { name } = formValue ?? {};

  return (
    <form action={save}>
      <ResponsiveWrapper className="w-full">
        <PictureInput className="w-full lg:w-1/3" part={part} defaultValue={defaultValue} />

        <ColumnWrapper className="w-full lg:w-2/3 px-5 justify-center">
          <TextArea
            name="name"
            placeholder="Name"
            className="text-4xl font-bold mb-4"
            defaultValue={name}
            required
          />
          <PartInput defaultValue={defaultValue} />
          {defaultValue?.url && (
            <RedirectButton href={defaultValue?.url} target="_blank">
              To brand page
            </RedirectButton>
          )}
          <RowWrapper>
            {!pending && formValue && (
              <Button type="submit" className="px-2 flex-1" formAction={() => save(null)}>
                Delete
              </Button>
            )}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Saving..." : "Save"}
            </Button>
          </RowWrapper>
          {error && <NotificationBar message={error} remove={() => setError(null)} alert />}
        </ColumnWrapper>
      </ResponsiveWrapper>
    </form>
  );
}

function PictureInput({
  part,
  className,
  defaultValue,
}: Readonly<{
  part: Products;
  className?: string;
  defaultValue?: Part.DTO;
}>) {
  const [image, setImage] = useState<string | undefined>(defaultValue?.image_url ?? undefined);

  return (
    <ColumnWrapper className={className}>
      <PartPicture className="w-full" part={part} src={image} onError={() => setImage(undefined)} />
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
