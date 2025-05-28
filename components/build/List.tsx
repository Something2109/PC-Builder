"use client";

import { useBuildContext } from "./hook/BuildDetail";
import { useProductSelect } from "./hook/ProductSelect";
import { Button } from "../utils/Button";
import { Product } from "@/utils/interface/part";
import { Products } from "@/utils/Enum";

const ProductRenderOrder = [
  Products.CPU,
  Products.GRAPHIC_CARD,
  Products.MAIN,
  Products.RAM,
  Products.SSD,
  Products.HDD,
  Products.PSU,
  Products.CASE,
  Products.FAN,
  Products.COOLER,
  Products.AIO,
  Products.CPU_BLOCK,
  Products.RADIATOR,
  Products.PUMP,
];

export default function BuildProductList() {
  const { details: context } = useBuildContext();
  const { product: selected, setProduct } = useProductSelect();

  return (
    <>
      {ProductRenderOrder.map((product) => {
        const details = context[product];
        return (
          <Button
            key={product}
            className="space-y-2 border-2 px-4 w-full text-left rounded-lg"
            onClick={() => setProduct(product)}
            disabled={selected === product}
          >
            <h2 className="text-lg font-semibold">{Product.Label[product]}</h2>
            {Array.isArray(details) ? (
              details.length > 0 ? (
                <ul>
                  {details.map((detail) => (
                    <li key={detail.name}>{detail.name}</li>
                  ))}
                </ul>
              ) : (
                "No product selected"
              )
            ) : details ? (
              details.name
            ) : (
              "No product selected"
            )}
          </Button>
        );
      })}
    </>
  );
}
