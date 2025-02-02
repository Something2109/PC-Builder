"use client";

import { Button, InputButton } from "@/components/utils/Button";
import {
  ColumnWrapper,
  ResponsiveWrapper,
  RowWrapper,
} from "@/components/utils/FlexWrapper";
import { Info, Products } from "@/utils/Enum";
import { useRouter } from "next/navigation";
import { lazy, FormEvent, useState, FormHTMLAttributes } from "react";
import { DetailInfo, InfoLabels, ProductInfo } from "@/utils/interface";
import { ObjectTable } from "../utils/ObjectTable";
import { NotificationBar } from "../utils/NotificationBar";

const PartFieldset = lazy(() => import("@/components/part/input/Part"));

const InputComponent = {
  [Info.CPU]: lazy(() => import("@/components/part/input/CPU")),
  [Info.GPU]: lazy(() => import("@/components/part/input/GPU")),
  [Info.GRAPHIC_CARD]: lazy(
    () => import("@/components/part/input/GraphicCard")
  ),
  [Info.MAIN]: lazy(() => import("@/components/part/input/Mainboard")),
  [Info.RAM]: lazy(() => import("@/components/part/input/RAM")),
  [Info.HDD]: lazy(() => import("@/components/part/input/HDD")),
  [Info.PSU]: lazy(() => import("@/components/part/input/PSU")),
  [Info.CASE]: lazy(() => import("@/components/part/input/Case")),
  [Info.COOLER]: lazy(() => import("@/components/part/input/Cooler")),
  [Info.AIO]: lazy(() => import("@/components/part/input/AIO")),
  [Info.FAN]: lazy(() => import("@/components/part/input/Fan")),
  [Info.SSD]: lazy(() => import("@/components/part/input/SSD")),
  [Info.CPU_BLOCK]: lazy(() => import("@/components/part/input/CPUBlock")),
  [Info.PUMP]: lazy(() => import("@/components/part/input/Pump")),
  [Info.RADIATOR]: lazy(() => import("@/components/part/input/Radiator")),
};

export default function PartForm({
  part,
  defaultValue,
  ...rest
}: {
  part: Products;
  defaultValue: DetailInfo;
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

  return (
    <form {...rest}>
      <RowWrapper className="flex-row-reverse sticky top-32">
        <Button onClick={onDelete}>Delete</Button>
        <InputButton type="submit" />
        {error ? (
          <NotificationBar
            message={error}
            remove={() => setError(null)}
            alert
          />
        ) : undefined}
      </RowWrapper>
      <PartFieldset defaultValue={defaultValue} />
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
          {ProductInfo[part].map((info) => {
            const Component = InputComponent[info];

            if (!Component) return undefined;

            const value = defaultValue ? defaultValue[info] : undefined;

            return (
              <>
                <h1 className="text-4xl font-bold">{InfoLabels[info]}</h1>
                <Component defaultValue={value as any} />
              </>
            );
          })}
        </ColumnWrapper>
      </ResponsiveWrapper>
    </form>
  );
}

export { PartForm };
