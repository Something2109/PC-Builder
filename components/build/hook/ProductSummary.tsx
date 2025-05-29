import { useProductType } from "./ProductType";
import { useBuildContext } from "./BuildContext";
import Part from "@/utils/interface/part";
import { API } from "@/utils/interface/api";
import { useEffect, useState, useReducer } from "react";

type ProductLoad = {
  data: API.Payload<Part.Summary> | null;
  params: URLSearchParams;
  page: number;
  setParams: (params: FormData) => void;
  setPage: (num: number) => void;
};

function useProductSummary(): ProductLoad {
  const { list } = useBuildContext();
  const { productType } = useProductType();

  const [data, setData] = useState<API.Payload<Part.Summary> | null>(null);
  const [page, setPage] = useState(1);
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
  }, [productType]);

  useEffect(() => {
    fetch(`/api/build/${productType}?${params.toString()}&page=${page}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(list),
    }).then((response) => {
      if (response.ok) {
        response.json().then((val) => setData(val));
        window.scroll({ top: 0, behavior: "smooth" });
      }
    });
  }, [productType, params, page]);

  return { data, params, page, setParams, setPage };
}

export default useProductSummary;
