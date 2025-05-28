import { useProductSelect } from "./ProductSelect";
import { useBuildContext } from "./BuildDetail";
import Part from "@/utils/interface/part";
import { API } from "@/utils/interface/api";
import { useEffect, useState } from "react";

function useProductLoad() {
  const { list } = useBuildContext();
  const { product, params, page } = useProductSelect();
  const [data, setData] = useState<API.Payload<Part.Summary> | null>(null);

  useEffect(() => {
    fetch(`/api/build/${product}?${params.toString()}&page=${page}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(list),
    }).then((response) => {
      if (response.ok) {
        response.json().then((val) => setData(val));
        window.scroll({ top: 0, behavior: "smooth" });
      }
    });
  }, [product, params, page]);

  return data;
}

export default useProductLoad;
