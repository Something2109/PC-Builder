import { useQuery } from "@tanstack/react-query";
import { FunctionComponent, InputHTMLAttributes, SelectHTMLAttributes } from "react";

import { VerticalCollapsible } from "@/ui/Collapsible";
import { Toggler } from "@/ui/Toggle";
import { Products } from "@pc-builder/shared/part";

import { InfoLabel } from "../utils/Table";

type CustomFilterComponent<Value> = FunctionComponent<
  { value: NonNullable<Value>; defaultValue?: Value } & Omit<
    InputHTMLAttributes<HTMLInputElement> & SelectHTMLAttributes<HTMLSelectElement>,
    "defaultValue" | "value"
  >
>;

export type FilterMapping<T extends Record<string, unknown>> = {
  [key in keyof Required<T>]: CustomFilterComponent<T[key]>;
};

export function GenericFilterBar<T extends Record<string, string[] | number[]>>(
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
        value={state}
        defaultValue={context.getAll(attribute) as Value}
      />
    </VerticalCollapsible>
  );
}
