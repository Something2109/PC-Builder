"use client";

import { useRef, useReducer, useCallback } from "react";

type MappingType<T, Key extends string> = { [key in Key]: T };

function toEntries<T extends {}, Key extends string>(obj: MappingType<T, Key>) {
  return Object.entries(obj) as [Key, T][];
}

export function useObjectSet<
  T extends {},
  ConstructParams extends any[],
  Key extends string
>(
  construct: (...arg: ConstructParams) => T,
  generateKey: (info: T) => Key,
  defaultValue?: T[] | null
) {
  const SetObject = useRef<MappingType<T, Key>>(
    defaultValue?.reduce((acc, curr) => {
      const key = generateKey(curr);
      acc[key] = curr;

      return acc;
    }, {} as MappingType<T, Key>) ?? ({} as MappingType<T, Key>)
  );
  const [renderInfos, setRenderInfos] = useReducer(
    () => toEntries(SetObject.current),
    toEntries(SetObject.current)
  );

  const addT = useCallback(
    (...arg: ConstructParams) => {
      const info = construct(...arg);
      const key = generateKey(info);

      if (!SetObject.current[key] && key !== "") {
        SetObject.current[key] = info;
        setRenderInfos();
      }
    },
    [defaultValue]
  );

  const deleteT = useCallback(
    (info: T) => {
      const key = generateKey(info);
      delete SetObject.current[key];
      setRenderInfos();
    },
    [defaultValue]
  );

  const existT = useCallback(
    (key: Key) => Boolean(SetObject.current[key]),
    [defaultValue]
  );

  const changeT = useCallback(
    (info: T, change: Partial<T>) => {
      const oldKey = generateKey(info);

      const newObj = { ...info, ...change };
      const newKey = generateKey(info);

      if (newKey !== oldKey) {
        if (newKey === "" || SetObject.current[newKey]) return info;

        delete SetObject.current[oldKey];
        SetObject.current[newKey] = info;
      }

      Object.keys(info).forEach((attr) => {
        info[attr as keyof T] = newObj[attr as keyof T];
      });

      return info;
    },
    [defaultValue]
  );

  return [renderInfos, addT, deleteT, existT, changeT] as const;
}
