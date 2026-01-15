"use client";

import Build from "@/utils/build";
import Part, { Products } from "@/utils/part";
import { createContext, useContext, useReducer, useRef } from "react";

type DetailMapping<T = Part.DTO> = {
  [key in Products]?: T[];
};

const ArrayProducts = new Set<Products>([
  Products.GRAPHIC_CARD,
  Products.RAM,
  Products.SSD,
  Products.HDD,
  Products.FAN,
]);

class BuildDetailBuilder {
  private readonly details: DetailMapping<Part.Summary>;

  constructor(details: Build.Details<Part.Summary>) {
    this.details = Object.values(Products).reduce((acc, product) => {
      if (Array.isArray(details[product])) {
        acc[product] = details[product];
      } else {
        acc[product] = details[product] ? [details[product]] : [];
      }

      return acc;
    }, {} as DetailMapping<Part.Summary>);
  }

  add(product: Products, summary: Part.Summary) {
    if (
      !ArrayProducts.has(product) &&
      this.details[product] &&
      this.details[product].length > 1
    ) {
      return undefined;
    }

    this.details[product] ??= [];

    this.details[product].push(summary);

    return summary;
  }

  remove(product: Products, summary: Part.Summary) {
    if (!this.details[product]) return undefined;

    const index = this.details[product].indexOf(summary);
    if (index > -1) {
      this.details[product].splice(index, 1);

      if (this.details[product].length === 0) delete this.details[product];

      return summary;
    }

    return undefined;
  }

  list(): Build.List {
    const entries = Object.entries(this.details)
      .map(([key, values]) => {
        const list = values.map((val) => val.id);

        if (ArrayProducts.has(key as Products)) return [key, list];

        return [key, list[0]];
      })
      .filter(
        ([, list]) => list && (Array.isArray(list) ? list.length > 0 : true)
      );

    return Object.fromEntries(entries);
  }

  detail(): Build.Details<Part.Summary> {
    const entries = Object.entries(this.details)
      .map(([key, list]) => {
        if (ArrayProducts.has(key as Products)) return [key, list];

        return [key, list[0]];
      })
      .filter(
        ([, list]) => list && (Array.isArray(list) ? list.length > 0 : true)
      );

    return Object.fromEntries(entries);
  }
}

function useBuildDetails(defaultValue: Build.Details<Part.Summary>) {
  const builder = useRef(new BuildDetailBuilder(defaultValue));
  const [{ details, list }, setDetails] = useReducer(
    () => ({ details: builder.current.detail(), list: builder.current.list() }),
    { details: builder.current.detail(), list: builder.current.list() }
  );

  const add = (summary: Part.Summary) => {
    const result = builder.current.add(summary.part, summary);
    if (result) setDetails();
  };

  const remove = (summary: Part.Summary) => {
    const result = builder.current.remove(summary.part, summary);
    if (result) setDetails();
  };

  return { details, list, add, remove } as const;
}

type BuildContext = {
  details: Build.Details<Part.Summary>;
  list: Build.List;
  add: (p: Part.Summary) => void;
  remove: (p: Part.Summary) => void;
};

const BuildPartContext = createContext<BuildContext>({
  details: {},
  list: {},
  add: () => {},
  remove: () => {},
});

function BuildProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const buildDetail = useBuildDetails({});

  return (
    <BuildPartContext.Provider value={buildDetail}>
      {children}
    </BuildPartContext.Provider>
  );
}

function useBuildContext() {
  return useContext(BuildPartContext);
}

export { BuildProvider, useBuildContext };
