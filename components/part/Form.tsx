"use client";

import { Button, InputButton } from "@/components/utils/Button";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { Input } from "@/components/utils/Input";
import { NotificationBar } from "@/components/utils/NotificationBar";
import { Products } from "@/utils/Enum";
import { useRouter } from "next/navigation";
import React, { lazy, FormEvent, useState, FormHTMLAttributes } from "react";
import { DetailInfo } from "@/utils/interface";
import { PictureInput } from "./input/utils";
import { ObjectTable } from "../utils/ObjectTable";

const PartFieldset = lazy(() => import("@/components/part/input/Part"));

const InputComponent = {
  [Products.CPU]: lazy(() => import("@/components/part/input/CPU")),
  [Products.GPU]: lazy(() => import("@/components/part/input/GPU")),
  [Products.GRAPHIC_CARD]: lazy(
    () => import("@/components/part/input/GraphicCard")
  ),
  [Products.MAIN]: lazy(() => import("@/components/part/input/Mainboard")),
  [Products.RAM]: lazy(() => import("@/components/part/input/RAM")),
  [Products.HDD]: lazy(() => import("@/components/part/input/HDD")),
  [Products.PSU]: lazy(() => import("@/components/part/input/PSU")),
  [Products.CASE]: lazy(() => import("@/components/part/input/Case")),
  [Products.COOLER]: lazy(() => import("@/components/part/input/Cooler")),
  [Products.AIO]: lazy(() => import("@/components/part/input/AIO")),
  [Products.FAN]: lazy(() => import("@/components/part/input/Fan")),
  [Products.SSD]: lazy(() => import("@/components/part/input/SSD")),
  [Products.CPU_BLOCK]: lazy(() => import("@/components/part/input/CPUBlock")),
  [Products.PUMP]: lazy(() => import("@/components/part/input/Pump")),
  [Products.RADIATOR]: lazy(() => import("@/components/part/input/Radiator")),
};

export default function PartForm({
  part,
  defaultValue,
  ...rest
}: {
  part: Products;
  defaultValue?: DetailInfo<Products>;
} & Omit<FormHTMLAttributes<HTMLFormElement>, "defaultValue">) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  rest.onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const {
      name,
      code_name,
      brand,
      series,
      launch_date,
      url,
      image_url,
      ...detail
    } = Object.fromEntries(formData.entries());

    const result = {
      id: defaultValue?.id ?? undefined,
      part,
      name,
      code_name,
      brand,
      series,
      url: (url as string).length > 0 ? url : null,
      image_url: (image_url as string).length > 0 ? image_url : null,
      launch_date,
      [part]: detail,
    };

    fetch("/api/part", {
      method: "POST",
      body: JSON.stringify(result),
    }).then((response) => {
      if (response.ok) {
        response
          .json()
          .then((value) => router.push(`/part/${value.part}/${value.id}`));
      } else {
        response.json().then((value) => setError(value.message));
      }
    });
  };

  const onDelete = () => {
    if (confirm(`Are you sure you want to delete ${defaultValue?.name}`)) {
      fetch("/api/part", {
        method: "DELETE",
        body: JSON.stringify(defaultValue),
      }).then((response) => {
        if (response.ok) {
          response.json().then((value) => router.push(`/part/${value.part}`));
        } else {
          response.json().then((value) => setError(value.message));
        }
      });
    }
  };

  const DetailInput = InputComponent[part as Products];

  return (
    <form {...rest}>
      <ResponsiveWrapper className="w-full">
        <PictureInput
          className="w-full lg:w-1/3"
          part={{
            part,
            name: defaultValue?.name ?? "New part",
            image_url: defaultValue?.image_url,
          }}
        />

        <ColumnWrapper className="w-full lg:w-2/3 p-5">
          <Input
            name="name"
            placeholder="Name"
            className="text-4xl font-bold"
            defaultValue={defaultValue?.name}
            required
          />
          <PartFieldset defaultValue={defaultValue} />
          {error ? (
            <NotificationBar
              message={error}
              remove={() => setError(null)}
              alert
            />
          ) : undefined}
          <InputButton type="submit" />
          <Button onClick={onDelete}>Delete</Button>
        </ColumnWrapper>
      </ResponsiveWrapper>
      <ResponsiveWrapper className="w-full align-top">
        <ColumnWrapper className="basis-1/2">
          <h1 className="text-4xl font-bold">Raw</h1>
          <ObjectTable
            className="border-2"
            object={
              defaultValue?.raw ? JSON.parse(defaultValue.raw) : undefined
            }
          />
        </ColumnWrapper>
        <ColumnWrapper className="basis-1/2">
          <h1 className="text-4xl font-bold">Details</h1>
          <DetailInput
            className="sticky top-32"
            defaultValue={
              defaultValue ? (defaultValue[part as Products] as any) : undefined
            }
          />
        </ColumnWrapper>
      </ResponsiveWrapper>
    </form>
  );
}

export { PartForm };
