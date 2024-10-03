"use client";

import { AIOFieldset } from "@/components/part/input/AIO";
import { CaseFieldset } from "@/components/part/input/Case";
import { CoolerFieldset } from "@/components/part/input/Cooler";
import { CPUFieldset } from "@/components/part/input/CPU";
import { FanFieldset } from "@/components/part/input/Fan";
import { GPUFieldset } from "@/components/part/input/GPU";
import { GraphicCardFieldset } from "@/components/part/input/GraphicCard";
import { HDDFieldset } from "@/components/part/input/HDD";
import { MainboardFieldset } from "@/components/part/input/Mainboard";
import { PSUFieldset } from "@/components/part/input/PSU";
import { RAMFieldset } from "@/components/part/input/RAM";
import { SSDFieldset } from "@/components/part/input/SSD";
import { PartFieldset } from "@/components/part/input/Part";
import { InputButton } from "@/components/utils/Button";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { Input } from "@/components/utils/Input";
import { NotificationBar } from "@/components/utils/NotificationBar";
import { Products } from "@/utils/Enum";
import { useRouter } from "next/navigation";
import React, {
  FormEvent,
  useState,
  TableHTMLAttributes,
  FormHTMLAttributes,
} from "react";
import { DetailInfo } from "@/utils/interface";
import { PictureInput } from "./input/utils";
import { ObjectTable } from "../utils/ObjectTable";

const InputComponent: {
  [key in Products]: (
    props: {
      defaultValue?: Partial<any>;
    } & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">
  ) => JSX.Element;
} = {
  [Products.CPU]: CPUFieldset,
  [Products.GPU]: GPUFieldset,
  [Products.GRAPHIC_CARD]: GraphicCardFieldset,
  [Products.MAIN]: MainboardFieldset,
  [Products.RAM]: RAMFieldset,
  [Products.HDD]: HDDFieldset,
  [Products.PSU]: PSUFieldset,
  [Products.CASE]: CaseFieldset,
  [Products.COOLER]: CoolerFieldset,
  [Products.AIO]: AIOFieldset,
  [Products.FAN]: FanFieldset,
  [Products.SSD]: SSDFieldset,
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
    let result: any = {};
    formData.entries().forEach(([key, value]) => {
      result[key] = value;
    });

    const {
      name,
      code_name,
      brand,
      series,
      launch_date,
      url,
      image_url,
      ...detail
    } = result;

    result = {
      id: defaultValue?.id ?? undefined,
      part,
      name,
      code_name,
      brand,
      series,
      url: url.length > 0 ? url : null,
      image_url: image_url.length > 0 ? image_url : null,
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
              defaultValue ? defaultValue[part as Products] : undefined
            }
          />
        </ColumnWrapper>
      </ResponsiveWrapper>
    </form>
  );
}

export { PartForm };
