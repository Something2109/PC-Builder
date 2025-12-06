"use client";

import {
  lazy,
  FormHTMLAttributes,
  LazyExoticComponent,
  FunctionComponent,
} from "react";
import { RowWrapper } from "../utils/FlexWrapper";
import { Button } from "../utils/Button";
import { Input } from "../utils/Input";
import { Products } from "@/utils/part";
import { useRouter } from "next/navigation";
import PartFilter from "./filter/Part";

const FilterComponents: {
  [key in Products]: LazyExoticComponent<
    FunctionComponent<{
      product: Products;
      context: URLSearchParams;
    }>
  >;
} = {
  [Products.CPU]: lazy(() => import("@/components/part/filter/CPU")),
  [Products.GPU]: lazy(() => import("@/components/part/filter/GPU")),
  [Products.GRAPHIC_CARD]: lazy(
    () => import("@/components/part/filter/GraphicCard")
  ),
  [Products.MAIN]: lazy(() => import("@/components/part/filter/Mainboard")),
  [Products.RAM]: lazy(() => import("@/components/part/filter/RAM")),
  [Products.HDD]: lazy(() => import("@/components/part/filter/HDD")),
  [Products.PSU]: lazy(() => import("@/components/part/filter/PSU")),
  [Products.CASE]: lazy(() => import("@/components/part/filter/Case")),
  [Products.COOLER]: lazy(() => import("@/components/part/filter/Cooler")),
  [Products.AIO]: lazy(() => import("@/components/part/filter/AIO")),
  [Products.FAN]: lazy(() => import("@/components/part/filter/Fan")),
  [Products.SSD]: lazy(() => import("@/components/part/filter/SSD")),
  [Products.CPU_BLOCK]: lazy(() => import("@/components/part/filter/CPUBlock")),
  [Products.PUMP]: lazy(() => import("@/components/part/filter/Pump")),
  [Products.RADIATOR]: lazy(() => import("@/components/part/filter/Radiator")),
};

export function FilterBar({
  part,
  context,
  className,
  ...rest
}: {
  part: Products;
  context: URLSearchParams;
} & FormHTMLAttributes<HTMLFormElement>) {
  const router = useRouter();

  if (!FilterComponents[part]) return;

  const Component = FilterComponents[part];
  const options = new URLSearchParams(context);

  return (
    <form className={`flex flex-col gap-1 ${className}`} {...rest}>
      <RowWrapper className="flex-wrap justify-between gap-2 mb-10">
        <RowWrapper className="w-full px-4 py-1 rounded-2xl border-2">
          <Input
            className="focus:outline-none bg-transparent"
            name="q"
            defaultValue={options.get("q") || ""}
            placeholder="Search"
          />
        </RowWrapper>
        <PartFilter product={part} context={options} />
        <Component product={part} context={options} />
      </RowWrapper>
      <hr />
      <RowWrapper className="justify-end">
        <Button type="submit">Filter</Button>
        <Button type="reset" onClick={() => router.replace(`/part/${part}`)}>
          Reset
        </Button>
      </RowWrapper>
    </form>
  );
}
