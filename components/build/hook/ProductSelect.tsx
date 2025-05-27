"use client";

import { Products } from "@/utils/Enum";
import { createContext, useContext, useReducer, useState } from "react";

type ProductContext = {
  product: Products;
  params: URLSearchParams;
  page: number;
  setProduct: (p: Products) => void;
  setParams: (params: FormData) => void;
  setPage: (n: number) => void;
};

const ProductSelectContext = createContext<ProductContext>({
  product: Products.CPU,
  params: new URLSearchParams(),
  page: 1,
  setProduct: () => {},
  setParams: () => {},
  setPage: () => {},
});

function ProductSelectProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState(1);
  const [params, setParams] = useReducer((_, formData: FormData) => {
    setPage(1);
    return new URLSearchParams(formData.entries().toArray() as string[][]);
  }, new URLSearchParams());
  const [product, setProduct] = useReducer((_, product: Products) => {
    setParams(new FormData());
    return product;
  }, Products.CPU);

  return (
    <ProductSelectContext.Provider
      value={{ product, params, page, setProduct, setParams, setPage }}
    >
      {children}
    </ProductSelectContext.Provider>
  );
}

function useProductSelect() {
  return useContext(ProductSelectContext);
}

export { ProductSelectProvider, useProductSelect };
