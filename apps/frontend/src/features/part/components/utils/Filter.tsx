import { Products } from "@pc-builder/shared/part";
import { useQuery } from "@tanstack/react-query";
import { FunctionComponent, InputHTMLAttributes, SelectHTMLAttributes } from "react";

import { TransformedChangeEvent } from "@/components/ui/Input/base";
import { VerticalCollapsible } from "@/ui/Collapsible";
import { Toggler } from "@/ui/Toggle";

import { InfoLabel } from "../utils/Table";

type CustomFilterComponent<Value> = FunctionComponent<
  {
    value?: Value;
    defaultValue?: Value;
    product: Products;
    context: URLSearchParams;
    onChange?: (value: TransformedChangeEvent<Value>) => void;
  } & Omit<
    InputHTMLAttributes<HTMLInputElement> & SelectHTMLAttributes<HTMLSelectElement>,
    "defaultValue" | "value" | "onChange"
  >
>;

export type FilterMapping<T extends Record<string, unknown>> = {
  [key in keyof Required<T>]: CustomFilterComponent<T[key]>;
};

export function GenericFilterBar<T extends Record<string, unknown>>(
  Components: FilterMapping<T>,
  Labels: InfoLabel<T>
) {
  const FilterBar = ({ product, context }: { product: Products; context: URLSearchParams }) => (
    <>
      {Object.entries(Components).map(([key, Component]) => (
        <Toggler
          className="w-full"
          key={`Filter-${key}`}
          label={`Add ${Labels[key]} Filter`}
          defaultToggle={context.getAll(key).length > 0}
        >
          <FilterAttributeComponent
            product={product}
            context={context}
            attribute={key}
            label={Labels[key]}
            Component={Component}
          />
        </Toggler>
      ))}
    </>
  );

  return FilterBar;
}

function FilterAttributeComponent<Value>({
  product,
  attribute,
  context,
  label,
  Component,
}: Readonly<{
  product: Products;
  attribute: string;
  context: URLSearchParams;
  label: string;
  Component: CustomFilterComponent<Value>;
}>) {
  const { data: state = null, isLoading } = useQuery<Value | null>({
    queryKey: ["partFilter", product, attribute, context.toString()],
    queryFn: async () => {
      const response = await fetch(
        `/api/part/filter/${product}/${attribute}?${context.toString()}`
      );
      if (!response.ok) return [] as unknown as Value;
      const data = await response.json();
      return data[attribute];
    },
  });

  if (isLoading || !state) return "Loading";

  return (
    <VerticalCollapsible className="w-full">
      <label htmlFor={attribute}>{label}</label>
      <Component
        id={`Filter-${attribute}`}
        name={attribute}
        title={label}
        placeholder={label}
        defaultValue={state}
        product={product}
        context={context}
      />
    </VerticalCollapsible>
  );
}
