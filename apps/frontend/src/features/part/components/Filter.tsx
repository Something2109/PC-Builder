"use client";

import { useRouter } from "next/navigation";
import { lazy, FormHTMLAttributes, LazyExoticComponent, FunctionComponent } from "react";

import { Button } from "@/ui/Button";
import { RowWrapper } from "@/ui/FlexWrapper";
import { Input } from "@/ui/Input";
import { Products } from "@/utils/part";

import PartFilter from "./filter/Part";

const FilterComponents: {
  [key in Products]: LazyExoticComponent<
    FunctionComponent<{
      product: Products;
      context: URLSearchParams;
    }>
  >;
} = {
  [Products.CPU]: lazy(() => import("@/features/part/components/filter/CPU")),
  [Products.GPU]: lazy(() => import("@/features/part/components/filter/GPU")),
  [Products.GRAPHIC_CARD]: lazy(() => import("@/features/part/components/filter/GraphicCard")),
  [Products.MAIN]: lazy(() => import("@/features/part/components/filter/Mainboard")),
  [Products.RAM]: lazy(() => import("@/features/part/components/filter/RAM")),
  [Products.HDD]: lazy(() => import("@/features/part/components/filter/HDD")),
  [Products.PSU]: lazy(() => import("@/features/part/components/filter/PSU")),
  [Products.CASE]: lazy(() => import("@/features/part/components/filter/Case")),
  [Products.COOLER]: lazy(() => import("@/features/part/components/filter/Cooler")),
  [Products.AIO]: lazy(() => import("@/features/part/components/filter/AIO")),
  [Products.FAN]: lazy(() => import("@/features/part/components/filter/Fan")),
  [Products.SSD]: lazy(() => import("@/features/part/components/filter/SSD")),
  [Products.CPU_BLOCK]: lazy(() => import("@/features/part/components/filter/CPUBlock")),
  [Products.PUMP]: lazy(() => import("@/features/part/components/filter/Pump")),
  [Products.RADIATOR]: lazy(() => import("@/features/part/components/filter/Radiator")),
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
