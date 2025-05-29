"use client";

import { Products } from "@/utils/Enum";
import { createContext, useContext, useState } from "react";

type ProductContext = {
  productType: Products;
  setProductType: (p: Products) => void;
};

const ProductSelectContext = createContext<ProductContext>({
  productType: Products.CPU,
  setProductType: () => {},
});

function ProductTypeProvider({ children }: { children: React.ReactNode }) {
  const [productType, setProductType] = useState(Products.CPU);

  return (
    <ProductSelectContext.Provider value={{ productType, setProductType }}>
      {children}
    </ProductSelectContext.Provider>
  );
}

function useProductType() {
  return useContext(ProductSelectContext);
}

export { ProductTypeProvider, useProductType };
