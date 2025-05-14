"use client";

import Part, { Information } from "@/utils/interface/part";
import { Infos } from "@/utils/Enum";
import {
  useRef,
  useActionState,
  useState,
  useReducer,
  useCallback,
} from "react";

export function useInfoAction(
  path: string,
  info: Infos,
  defaultValue: Part.Detail
) {
  const label = useRef(Information.Label[info]);
  const [error, setError] = useState<string | null>(null);
  const [formValue, save, pending] = useActionState<
    Partial<Part.Detail[typeof info]> | null,
    Partial<Part.Detail[typeof info]> | null
  >(async (prev, data) => {
    const operation = prev ? (data ? "save" : "delete") : "add";

    setError(null);
    if (
      !confirm(`Are you sure you want to ${operation} ${label.current} info?`)
    )
      return prev;

    const body = JSON.stringify({ [info]: data });

    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (!response.ok) {
      setError((await response.json()).message);
      return prev;
    } else {
      alert(`Successfully ${operation} ${label.current} info.`);
    }

    const newData = (await response.json()) as Part.Detail;

    return newData[info];
  }, defaultValue[info]);

  return [formValue, save, pending, error, setError] as const;
}

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
