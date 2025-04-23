import { ZodIssue } from "zod";
import { User } from "./user/User";

/**
 * The error namespace mapping the zod error of an object.
 * Define the error message type based on the object structure.
 */
export namespace API {
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
  type ArrayError<T extends ArrayError<any>> =
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
  type MapError<K, V> =
    | {
        [key in number]: {
          key?: Error<K>;
          value?: Error<V>;
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
        [key in number]: Error<T>;
      }
    | string;

  /**
   * The error message mapping of an object.
   * Can be a string when the type is invalid or
   * an object with the key pointing to the wrong value
   * and the value as the error message mapping of the value at the key index.
   */
  type ObjectError<T extends Object> =
    | {
        [key in keyof T]?: Error<T[key]>;
      }
    | string;

  /**
   * The generic typing of the message mapping.
   */
  export type Error<T> = T extends DefaultType
    ? string
    : T extends Array<any>
    ? ArrayError<T>
    : T extends Map<infer K, infer V>
    ? MapError<K, V>
    : T extends Set<infer Val>
    ? SetError<Val>
    : T extends Object
    ? ObjectError<T>
    : string;

  /**
   * Transform the zod issue list to the error message mapping.
   * @param issues The zod issue list
   * @returns The message mapping of the generic object.
   */
  export function toError<T extends Error<any>>(issues: ZodIssue[]) {
    return issues.reduce<string | {}>((acc, err) => {
      const path = err.path;
      if (path.length === 0) return err.message;

      path.reduce((curr, attr, index) => {
        curr[attr] =
          curr[attr] ?? (index === path.length - 1 ? err.message : {});
        return curr[attr];
      }, acc as any);

      return acc;
    }, {}) as Error<T>;
  }
}
