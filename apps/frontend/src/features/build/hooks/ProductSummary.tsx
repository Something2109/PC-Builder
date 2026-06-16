import { useQuery } from "@tanstack/react-query";
import { useBuildContext } from "./BuildContext";
import Part, { Products } from "@/utils/part";
import * as API from "@/utils/API";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";

type ProductLoad = {
  loading: boolean;
  data: API.Payload<Part.Summary> | null;
  params: URLSearchParams;
  page: number;
  includeBuild: boolean;
  setParams: (params: FormData) => void;
  setPage: (num: number) => void;
  setIncludeBuild: (val: boolean) => void;
};

function useProductSummary(product: Products): ProductLoad {
  const { list } = useBuildContext();
  const [page, setPage] = useState(1);
  const [includeBuild, setIncludeBuild] = useState(true);
  const [params, setParamsState] = useState(() => new URLSearchParams());

  const setParams = (formData: FormData) => {
    setPage(1);
    setParamsState(new URLSearchParams(formData.entries().toArray() as string[][]));
  };

  const [prevProduct, setPrevProduct] = useState(product);
  if (product !== prevProduct) {
    setPrevProduct(product);
    setPage(1);
    setParamsState(new URLSearchParams());
    setIncludeBuild(true);
  }

  const { data = null, isFetching: loading } = useQuery<API.Payload<Part.Summary> | null>({
    queryKey: ["productSummary", product, params.toString(), page, includeBuild, list],
    queryFn: async () => {
      try {
        const response = await axiosInstance.post<API.Payload<Part.Summary>>(
          `/build/${product}?${params.toString()}&page=${page}`,
          includeBuild ? list : undefined
        );
        return response.data;
      } catch (err) {
        console.error(err as AxiosError);
        return null;
      }
    },
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (data) {
      window.scroll({ top: 0, behavior: "smooth" });
    }
  }, [data]);

  return {
    loading,
    data,
    params,
    page,
    includeBuild,
    setParams,
    setPage,
    setIncludeBuild,
  };
}

export default useProductSummary;
