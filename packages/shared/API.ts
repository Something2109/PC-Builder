import { $ZodIssue } from "zod/v4/core";

import * as User from "./user";

/**
 * The error namespace mapping the zod error of an object.
 * Define the error message type based on the object structure.
 */
const DEFAULT_PAGE = 1;
const DEFAULT_ITEM_LIMIT = 50;

export enum Tokens {
  ACCESS = "access",
  REFRESH = "refresh",
}

export type Session = {
  type: Tokens;
  sub: User.JwtPayload;
};

/**
 * The page option interface.
 * Provide the option for pagination querying.
 */
export type PageOptions = {
  page: number;
  limit: number;
};

/**
 * The search option interface.
 * Provide the option for searching.
 */
export type SearchOptions = {
  q?: string;
};

/**
 * Extract the page options from the query parameters.
 * @param query The query to extract options from.
 * @returns The page options.
 */
export function toPageOptions(
  query: Record<string, string | string[]>
): PageOptions {
  const page = Number(Array.isArray(query.page) ? query.page[0] : query.page);
  const limit = Number(
    Array.isArray(query.limit) ? query.limit[0] : query.limit
  );

  const result: PageOptions = {
    page: page > 0 ? page : DEFAULT_PAGE,
    limit: limit > 0 ? limit : DEFAULT_ITEM_LIMIT,
  };

  return result;
}

/**
 * The payload generic object.
 * Contains a total number telling the total number of T
 * and the list of specific number of T object.
 */
export type Payload<T> = {
  total: number;
  list: T[];
};

/**
 * The default type that are guaranteed to not have any inner path.
 * Contains the primitive type and some atomic object.
 */
type DefaultType =
  | string
  | number
  | bigint
  | boolean
  | Function
  | Date
  | null
  | undefined;

/**
 * The error message mapping of an array.
 * Can be a string when the type is invalid or
 * an object with the number key for mapping the index
 * and the value as the error message mapping of the value at the key index.
 */
type ArrayError<T extends Array<unknown>> =
  | {
      [key in number]: Error<T[key]>;
    }
  | string;

/**
 * The error message mapping of the map data structure.
 * Can be a string when the type is invalid or
 * an object with the index key pointing to the mapping tuple
 * with a wrong type and the object value pointing the key or value error message.
 */
type MapError<T extends Map<unknown, unknown>> =
  | {
      [key in number]: {
        key?: T extends Map<infer K, any> ? Error<K> : never;
        value?: T extends Map<any, infer V> ? Error<V> : never;
      };
    }
  | string;

/**
 * The error message mapping of the set data structure.
 * Can be a string when the type is invalid or
 * an object with the number key for mapping the index
 * and the value as the error message mapping of the value at the key index.
 */
type SetError<T> =
  | {
      [key in number]: T extends Set<infer V> ? Error<V> : never;
    }
  | string;

/**
 * The error message mapping of an object.
 * Can be a string when the type is invalid or
 * an object with the key pointing to the wrong value
 * and the value as the error message mapping of the value at the key index.
 */
type ObjectError<T extends object> =
  | {
      [key in keyof T]?: Error<T[key]>;
    }
  | string;

/**
 * The generic typing of the message mapping.
 */
export type Error<T> = T extends DefaultType
  ? string
  : T extends Array<unknown>
    ? ArrayError<T>
    : T extends Map<unknown, unknown>
      ? MapError<T>
      : T extends Set<unknown>
        ? SetError<T>
        : T extends object
          ? ObjectError<T>
          : string;

// 1. Overload for when we expect a primitive / root-level string error
export function toError<_T extends DefaultType>(issues: $ZodIssue[]): string;

// 2. Overload for when we expect an array error structure
export function toError<T extends Array<unknown>>(
  issues: $ZodIssue[]
): ArrayError<T>;

// 3. Overload for when we expect a Map error structure
export function toError<T extends Map<any, any>>(
  issues: $ZodIssue[]
): MapError<T>;

// 4. Overload for when we expect a Set error structure
export function toError<T extends Set<unknown>>(
  issues: $ZodIssue[]
): SetError<T>;

// 5. Overload for standard objects
export function toError<T extends object>(issues: $ZodIssue[]): ObjectError<T>;

// 6. Fallback fallback / Catch-all
export function toError<T>(issues: $ZodIssue[]): Error<T>;

// Single Implementation block
export function toError<_T>(issues: $ZodIssue[]) {
  // 1. Intercept root-level failures upfront to safeguard object structural mapping
  const rootIssue = issues.find((issue) => issue.path.length === 0);
  if (rootIssue) return rootIssue.message;

  const result = {} as Record<PropertyKey, any>;

  // 2. Linear imperative loop instead of reduce avoids accumulator mutation conflicts
  for (const err of issues) {
    const { path, message } = err;
    let curr = result;

    for (let index = 0; index < path.length - 1; index++) {
      const attr = String(path[index]);

      // Dynamic branch defense: Ensure nested targets are clean parsing targets
      if (typeof curr[attr] !== "object" || curr[attr] === null) {
        curr[attr] = {};
      }
      curr = curr[attr];
    }

    const attr = path[path.length - 1];
    if (attr !== undefined) {
      // Retain initial validation message for fields with multiple broken constraints
      curr[attr] = curr[attr] ?? message;
    }
  }

  return result;
}
