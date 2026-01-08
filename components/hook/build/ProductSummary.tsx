import { useBuildContext } from "./BuildContext";
import Part, { Products } from "@/utils/part";
import * as API from "@/utils/API";
import { useEffect, useState, useReducer, useTransition } from "react";
import axios, { AxiosError } from "axios";

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

  const [loading, startTransition] = useTransition();
  const [data, setData] = useState<API.Payload<Part.Summary> | null>(null);
  const [page, setPage] = useState(1);
  const [includeBuild, setIncludeBuild] = useState(true);
  const [params, setParams] = useReducer(
    (_, formData: FormData) => {
      setPage(1);
      return new URLSearchParams(formData.entries().toArray() as string[][]);
    },
    null,
    () => new URLSearchParams()
  );

  useEffect(() => {
    setParams(new FormData());
    setPage(1);
  }, [product]);

  useEffect(
    () =>
      startTransition(async () => {
        try {
          const response = await axios.post<API.Payload<Part.Summary>>(
            `/api/build/${product}?${params.toString()}&page=${page}`,
            includeBuild ? list : undefined,
            { withCredentials: true }
          );

          setData(response.data);

          window.scroll({ top: 0, behavior: "smooth" });
        } catch (err) {
          const error = err as AxiosError;
          console.error(error);
          setData(null);
        }
      }),
    [list, product, params, page, includeBuild]
  );

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
