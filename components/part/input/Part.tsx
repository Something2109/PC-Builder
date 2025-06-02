"use client";

import { InfoComponent, InfoComponentObject } from "../utils/Table";
import PartPicture from "../Picture";
import usePartAction from "@/components/hook/part/PartAction";
import { NotificationBar } from "@/components/utils/NotificationBar";
import { Button, RedirectButton } from "@/components/utils/Button";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { Input } from "@/components/utils/Input";
import Part from "@/utils/interface/part";
import { Products } from "@/utils/Enum";
import { useState } from "react";

const Components: InfoComponentObject<
  Omit<Part.BasicInfo, "id" | "part" | "name" | "image_url">
> = {
  code_name: (props) => <Input {...props} />,
  brand: (props) => <Input {...props} />,
  series: (props) => <Input {...props} />,
  url: ({ defaultValue, value, ...props }) => (
    <Input defaultValue={defaultValue ?? undefined} {...props} required />
  ),
  launch_date: ({ defaultValue, value, ...props }) => (
    <Input
      defaultValue={new Date(defaultValue ?? new Date())
        .toISOString()
        .slice(0, 10)}
      {...props}
    />
  ),
};

const PartInput = InfoComponent(Components, Part.Label);

export default function PartForm({
  path,
  part,
  defaultValue,
}: {
  path: string;
  part: Products;
  defaultValue?: Part.BasicInfo;
}) {
  const [formValue, save, pending, error, setError] = usePartAction(
    path,
    part,
    defaultValue
  );

  let { name } = formValue ?? {};

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
            defaultValue={name}
            required
          />
          <PartInput defaultValue={defaultValue} />
          {defaultValue?.url && (
            <RedirectButton href={defaultValue?.url} target="_blank">
              To brand page
            </RedirectButton>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Saving..." : "Save"}
          </Button>
          {!pending && formValue && (
            <Button
              type="submit"
              className="w-full"
              formAction={() => save(null)}
            >
              Delete
            </Button>
          )}
          {error && (
            <NotificationBar
              message={error}
              remove={() => setError(null)}
              alert
            />
          )}
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
  const [image, setImage] = useState<string | undefined>(
    defaultValue?.image_url ?? undefined
  );

  return (
    <ColumnWrapper className={className}>
      <PartPicture
        part={part}
        src={image}
        onError={() => setImage(undefined)}
      />
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
