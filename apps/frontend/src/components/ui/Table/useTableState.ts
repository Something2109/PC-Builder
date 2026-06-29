 
"use client";

import * as API from "@pc-builder/shared/API";
import { useState, useCallback } from "react";

export interface BaseTableQuery extends API.PageOptions {
  [key: string]: any;
}

export interface UseTableStateProps<TQuery extends BaseTableQuery> {
  initialState: TQuery;
  // Controlled external state (e.g. state managed globally or by parent)
  state?: TQuery;
  onChange?: (state: TQuery | ((prev: TQuery) => TQuery)) => void;
}

export function useTableState<TQuery extends BaseTableQuery>(props: UseTableStateProps<TQuery>) {
  // Local state fallback
  const [localState, setLocalState] = useState<TQuery>(props.initialState);

  const isControlled = !!props.state && !!props.onChange;
  const currentState = isControlled ? props.state! : localState;

  const updateState = useCallback(
    (updater: TQuery | ((prev: TQuery) => TQuery)) => {
      if (isControlled) {
        props.onChange!(updater);
      } else {
        setLocalState(updater);
      }
    },
    [isControlled, props]
  );

  const setPage = useCallback(
    (page: number) => {
      updateState((prev) => ({
        ...prev,
        page,
      }));
    },
    [updateState]
  );

  const setPageSize = useCallback(
    (limit: number) => {
      updateState((prev) => ({
        ...prev,
        limit,
        page: 1, // Reset to first page when limit changes
      }));
    },
    [updateState]
  );

  const setSort = useCallback(
    (sortKey?: string, sortOrder?: "asc" | "desc") => {
      updateState((prev) => ({
        ...prev,
        sort_key: sortKey,
        sort_order: sortOrder,
        page: 1, // Reset to first page when sorting changes
      }));
    },
    [updateState]
  );

  const setFilter = useCallback(
    (key: keyof TQuery, value: any) => {
      updateState((prev) => ({
        ...prev,
        [key]: value,
        page: 1, // Reset to first page when filters change
      }));
    },
    [updateState]
  );

  const resetFilters = useCallback(
    (keysToReset?: (keyof TQuery)[]) => {
      updateState((prev) => {
        const next = { ...prev };
        const keys = keysToReset || (Object.keys(props.initialState) as (keyof TQuery)[]);
        keys.forEach((key) => {
          if (key !== "page" && key !== "limit") {
            next[key] = props.initialState[key];
          }
        });
        next.page = 1;
        return next;
      });
    },
    [updateState, props.initialState]
  );

  return {
    state: currentState,
    setPage,
    setPageSize,
    setSort,
    setFilter,
    resetFilters,
    updateState,
  };
}
