import { Payload } from "@pc-builder/shared/API";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import axiosInstance from "@/lib/axios";

export function useInfiniteData<T>(path: string, context: URLSearchParams) {
  const query = useInfiniteQuery({
    queryKey: [path, context.toString()],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams(context);
      params.set("page", String(pageParam));
      params.set("limit", "20");

      const { data: resData } = await axiosInstance.get<Payload<T>>(path, { params });
      return resData;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      return lastPageParam >= lastPage.total ? lastPageParam + 1 : undefined;
    },
  });

  return useMemo(() => {
    return { ...query, data: query.data ? query.data.pages.map((res) => res.list).flat() : [] };
  }, [query]);
}
