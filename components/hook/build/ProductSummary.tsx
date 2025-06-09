import { useBuildContext } from "./BuildContext";
import Part from "@/utils/interface/part";
import { API } from "@/utils/interface/api";
import { Products } from "@/utils/Enum";
import { useEffect, useState, useReducer, useTransition } from "react";

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
        const response = await fetch(
          `/api/build/${product}?${params.toString()}&page=${page}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: includeBuild ? JSON.stringify(list) : undefined,
          }
        );

        setData(response.ok ? await response.json() : null);

        window.scroll({ top: 0, behavior: "smooth" });
      }),
    [product, params, page, includeBuild]
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
