"use client";

import { FormHTMLAttributes, useEffect, useState } from "react";
import { ColumnWrapper, RowWrapper } from "./utils/FlexWrapper";
import { Button } from "./utils/Button";
import { FilterOptions } from "@/utils/interface";
import { Products } from "@/utils/Enum";
import { VerticalCollapsible } from "./utils/Collapsible";
import { ChoiceInput } from "./utils/Input";

export function FilterBar({
  part,
  context,
  className,
  ...rest
}: {
  part: Products;
  context: URLSearchParams;
} & FormHTMLAttributes<HTMLFormElement>) {
  const [filter, setFilter] = useState<FilterOptions>({});
  const [error, setError] = useState(null);
  const options = new URLSearchParams(context);

  useEffect(() => {
    fetch(`/api/part/filter/${part}?${options.toString()}`).then((response) => {
      if (response.ok) {
        response.json().then((data) => setFilter(data));
      } else {
        response.json().then((data) => setError(data.message));
      }
    });
  }, []);

  if (error) return <h1>{error}</h1>;

  return (
    <form className={`flex flex-col gap-1 ${className}`} {...rest}>
      <RowWrapper className="sticky top-32 bg-white dark:bg-background transition-colors ease-in-out duration-500 delay-0">
        <Button type="submit">Filter</Button>
        <Button type="reset">Reset</Button>
      </RowWrapper>
      <input
        defaultValue={options.get("q") ?? ""}
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
            options={options}
          />
        ))}
      </ColumnWrapper>
    </form>
  );
}

function PartFieldset({
  name,
  filter,
  options,
}: {
  name: string;
  filter: Record<string, any[]> | null;
  options: URLSearchParams;
}) {
  return (
    <fieldset name={name} key={`filter-${name}`}>
      <VerticalCollapsible>
        <legend className="font-bold text-2xl">{name.toUpperCase()}</legend>
        {Object.entries(filter ?? {}).map(([key, value]) => {
          const keyOptions = options.getAll(key);

          return (
            <fieldset key={`filter-${key}`}>
              <VerticalCollapsible>
                <legend className="font-bold">{key.toUpperCase()}</legend>
                {value.map((options) => (
                  <ChoiceInput
                    type="checkbox"
                    key={`filter-${key}-${options}`}
                    name={key}
                    value={options}
                    defaultChecked={keyOptions.includes(options.toString())}
                  />
                ))}
              </VerticalCollapsible>
            </fieldset>
          );
        })}
      </VerticalCollapsible>
    </fieldset>
  );
}
