import { VerticalCollapsible } from "../../utils/Collapsible";
import { Toggler } from "../../utils/Toggle";
import { InfoLabel } from "../utils/Table";
import { Products } from "@/utils/Enum";
import {
  FunctionComponent,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  useEffect,
  useState,
} from "react";

type CustomFilterComponent<Value> = FunctionComponent<
  { value: NonNullable<Value>; defaultValue?: Value } & Omit<
    InputHTMLAttributes<HTMLInputElement> &
      SelectHTMLAttributes<HTMLSelectElement>,
    "defaultValue" | "value"
  >
>;

export type FilterMapping<T extends Record<string, any>> = {
  [key in keyof Required<T>]: CustomFilterComponent<T[key]>;
};

export function GenericFilterBar<T extends Record<string, string[] | number[]>>(
  Components: FilterMapping<T>,
  Labels: InfoLabel<T>
) {
  return ({
    product,
    context,
  }: {
    product: Products;
    context: URLSearchParams;
  }) => (
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
}

function FilterAttributeComponent<Value>({
  product,
  attribute,
  context,
  label,
  Component,
}: {
  product: Products;
  attribute: string;
  context: URLSearchParams;
  label: string;
  Component: CustomFilterComponent<Value>;
}) {
  const [state, setState] = useState<Value | null>(null);

  useEffect(() => {
    fetch(
      `/api/part/filter/${product}/${attribute}?${context.toString()}`
    ).then((response) => {
      if (response.ok) {
        response.json().then((data) => setState(data[attribute]));
      } else {
        setState([] as Value);
      }
    });
  }, [product, attribute, context]);

  if (!state) return "Loading";

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
