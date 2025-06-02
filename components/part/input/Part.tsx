"use client";

import { InfoComponent, InfoComponentObject } from "../utils/Table";
import PartPicture from "../Picture";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { Input } from "@/components/utils/Input";
import Part from "@/utils/interface/part";
import { Products } from "@/utils/Enum";
import { useState, TableHTMLAttributes, useActionState } from "react";
import { NotificationBar } from "@/components/utils/NotificationBar";
import { Button, RedirectButton } from "@/components/utils/Button";
import { useRouter } from "next/navigation";

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
  ...rest
}: {
  path: string;
  part: Products;
  defaultValue?: Part.BasicInfo;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [formValue, save, pending] = useActionState<
    Part.BasicInfo | undefined,
    FormData | null
  >(async (prev, formData) => {
    const operation = prev ? (formData ? "save" : "delete") : "add";
    const RequestPayload: RequestInit = {};

    if (formData) {
      const raw = Object.fromEntries(formData.entries()) as any;
      if (!raw.url) raw.url = undefined;
      if (!raw.image_url) raw.image_url = undefined;

      const data = Part.BasicInfo.omit({ id: true, part: true }).parse(raw);
      RequestPayload.method = "POST";
      RequestPayload.headers = { "Content-Type": "application/json" };
      RequestPayload.body = JSON.stringify(data);
    } else {
      RequestPayload.method = "DELETE";
    }

    setError(null);
    if (!confirm(`Are you sure you want to ${operation} basic info?`))
      return prev;

    const response = await fetch(path, RequestPayload);

    if (!response.ok) {
      setError((await response.json()).message);
      return prev;
    } else {
      alert(`Successfully ${operation} part info.`);
    }

    const newData = (await response.json()) as Part.BasicInfo;

    if (!prev && newData) router.push(`/part/${part}/${newData.id}/edit`);

    if (!formData) router.push(`/part/${part}`);

    return newData;
  }, defaultValue);

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
