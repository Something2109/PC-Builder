"use client";

import {
  Context,
  FormHTMLAttributes,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ColumnWrapper, RowWrapper } from "./utils/FlexWrapper";
import { InputButton } from "./utils/Button";
import { FilterOptions } from "@/utils/interface";
import { VerticalCollapsible } from "./utils/Collapsible";

export function FilterBar({
  defaultOptions,
  context,
  set,
  className,
  ...rest
}: {
  defaultOptions?: FilterOptions;
  context: Context<FilterOptions & { q?: string }>;
  set: (options: FilterOptions) => void;
} & FormHTMLAttributes<HTMLFormElement>) {
  const [filter, setFilter] = useState<FilterOptions>({});
  const [error, setError] = useState(null);
  const options = useContext(context);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetch(`/api/filter`, {
      method: "POST",
      body: JSON.stringify(options),
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => setFilter(data));
      } else {
        response.json().then((data) => setError(data.message));
      }
    });
  }, [options]);

  if (error) return <h1>{error}</h1>;

  rest.onSubmit = (e) => {
    e.preventDefault();

    const filterOptions: { [key in string]: { [key in string]: any[] } } = {
      ...(defaultOptions ?? {}),
    };

    const formData = new FormData(form.current!);
    formData.entries().forEach(([key, value]) => {
      const [part, name] = key.split("-");
      if (part && name) {
        filterOptions[part] = filterOptions[part] ?? {};
        filterOptions[part][name] = filterOptions[part][name] ?? [];

        filterOptions[part][name]!.push(value.toString());
      }
    });

    set(filterOptions as FilterOptions);
  };

  rest.onReset = () => {
    set(defaultOptions ?? {});
  };

  return (
    <form className={`flex flex-col gap-1 ${className}`} ref={form} {...rest}>
      <RowWrapper className="sticky top-32 bg-white dark:bg-background transition-all ease-in-out duration-500 delay-0">
        <InputButton type="submit" value="Filter" />
        <InputButton type="reset" />
      </RowWrapper>
      <input
        defaultValue={options.q ?? ""}
        type="text"
        name="q"
        placeholder="Search"
        className="rounded-2xl border-2 border-line px-4 py-1 focus:outline-none w-full bg-transparent"
      />
      <ColumnWrapper className="h-full overflow-auto ">
        {Object.entries(filter).map(([part, filterValue]) => (
          <PartFieldset
            key={`filter-${part}`}
            name={part}
            filter={filterValue}
          />
        ))}
      </ColumnWrapper>
    </form>
  );
}

function PartFieldset({
  name,
  filter,
}: {
  name: string;
  filter: Record<string, any[]>;
}) {
  function InputRow({ input, value }: { input: string; value: string }) {
    const id = `filter-${name}-${value}`;

    return (
      <RowWrapper>
        <input
          type="checkbox"
          id={id}
          name={`${name}-${input}`}
          value={value}
          defaultChecked={value.length === 1}
        />
        <label htmlFor={id}>{value}</label>
      </RowWrapper>
    );
  }

  return (
    <fieldset name={name} key={`filter-${name}`}>
      <VerticalCollapsible>
        <legend className="font-bold text-2xl">{name.toUpperCase()}</legend>
        {Object.entries(filter).map(([key, value]) => (
          <fieldset key={`filter-${key}`}>
            <VerticalCollapsible>
              <legend className="font-bold">{key.toUpperCase()}</legend>
              {value.map((options) => (
                <InputRow
                  key={`filter-${key}-${options}`}
                  input={key}
                  value={options}
                />
              ))}
            </VerticalCollapsible>
          </fieldset>
        ))}
      </VerticalCollapsible>
    </fieldset>
  );
}
