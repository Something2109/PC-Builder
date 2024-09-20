"use client";

import { PartType } from "@/utils/interface/Parts";
import { toSearchParams } from "@/utils/SearchParams";
import {
  Context,
  FormHTMLAttributes,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { RowWrapper } from "./utils/FlexWrapper";
import { InputButton } from "./utils/Button";

export function FilterBar({
  defaultOptions,
  context,
  set,
  className,
  ...rest
}: {
  defaultOptions?: PartType.FilterOptions;
  context: Context<PartType.FilterOptions & { q?: string }>;
  set: (options: PartType.FilterOptions) => void;
} & FormHTMLAttributes<HTMLFormElement>) {
  const [filter, setFilter] = useState<PartType.FilterOptions>({});
  const options = useContext(context);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetch(`/api/filter?${toSearchParams(options).toString()}`).then(
      (response) => {
        if (response.ok) {
          response.json().then((data) => setFilter(data));
        }
      }
    );
  }, [options]);

  rest.onSubmit = (e) => {
    e.preventDefault();

    const filterOptions: PartType.FilterOptions = {};
    Object.entries(defaultOptions ?? {}).forEach(
      ([key, value]) => (filterOptions[key as PartType.Filterables] = value)
    );

    const formData = new FormData(form.current!);
    formData.entries().forEach(([key, value]) => {
      if (!filterOptions[key as PartType.Filterables]) {
        filterOptions[key as PartType.Filterables] = [];
      }
      filterOptions[key as PartType.Filterables]!.push(value.toString());
    });

    set(filterOptions);
  };

  rest.onReset = () => {
    set(defaultOptions ?? {});
  };

  return (
    <form className={`flex flex-col gap-1 ${className}`} ref={form} {...rest}>
      <RowWrapper className="sticky top-32 bg-white dark:bg-background">
        <InputButton type="submit" />
        <InputButton type="reset" />
      </RowWrapper>
      <input
        defaultValue={options.q ?? ""}
        type="text"
        name="q"
        placeholder="Search"
        className="rounded-2xl border-2 border-line px-4 py-1 focus:outline-none w-full bg-transparent"
      />
      {Object.entries(filter).map(([key, value]) => {
        if (defaultOptions && defaultOptions[key as PartType.Filterables]) {
          return undefined;
        }
        return (
          <fieldset key={`filter-${key}`} className="mx-4">
            <legend className="font-bold">{key.toUpperCase()}</legend>
            {value.map((options) => {
              const id = `filter-${key}-${options}`;

              return (
                <RowWrapper key={id}>
                  <input
                    type="checkbox"
                    id={id}
                    name={key}
                    value={options}
                    defaultChecked={value.length === 1}
                  />
                  <label htmlFor={id}>{options}</label>
                </RowWrapper>
              );
            })}
          </fieldset>
        );
      })}
    </form>
  );
}
