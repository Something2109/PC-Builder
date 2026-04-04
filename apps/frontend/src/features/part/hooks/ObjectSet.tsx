"use client";

import { useState } from "react";

type MappingType<T, Key extends string> = { [key in Key]: T };

function toEntries<T extends object, Key extends string>(
  obj: MappingType<T, Key>
) {
  return Object.entries(obj) as [Key, T][];
}

export function useObjectSet<
  T extends object,
  ConstructParams extends unknown[],
  Key extends string
>(
  construct: (...arg: ConstructParams) => T,
  generateKey: (info: T) => Key,
  defaultValue?: T[] | null
) {
  const [renderInfos, setRenderInfos] = useState(
    defaultValue?.reduce((acc, curr) => {
      const key = generateKey(curr);
      acc[key] = curr;

      return acc;
    }, {} as MappingType<T, Key>) ?? ({} as MappingType<T, Key>)
  );

  const addT = (...arg: ConstructParams) => {
    const info = construct(...arg);
    const key = generateKey(info);

    if (!renderInfos[key] && key !== "") {
      setRenderInfos((prev) => ({ ...prev, [key]: info }));
    }
  };

  const deleteT = (info: T) => {
    const key = generateKey(info);

    setRenderInfos(
      ({ [key]: _, ...newList }) => newList as MappingType<T, Key>
    );
  };

  const existT = (key: Key) => Boolean(renderInfos[key]);

  const changeT = (info: T, change: Partial<T>) => {
    const oldKey = generateKey(info);

    const newObj = { ...info, ...change };
    const newKey = generateKey(info);

    if (newKey === "" || newKey === oldKey || renderInfos[newKey]) return info;

    setRenderInfos(
      ({ [oldKey]: _, ...newList }) =>
        ({ ...newList, [newKey]: newObj } as MappingType<T, Key>)
    );

    return newObj;
  };

  return [toEntries(renderInfos), addT, deleteT, existT, changeT] as const;
}
