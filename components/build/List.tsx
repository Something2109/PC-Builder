"use client";

import { useBuildContext } from "./hook/BuildContext";
import { useProductType } from "./hook/ProductType";
import { DeleteButton } from "../utils/Button";
import Part, { Product } from "@/utils/interface/part";
import { Products } from "@/utils/Enum";
import { useValidation } from "./hook/Validation";

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
  return (
    <>
      {ProductRenderOrder.map((product) => (
        <ProductTypeComponent key={product} product={product} />
      ))}
    </>
  );
}

function ProductTypeComponent({ product }: { product: Products }) {
  const { details: context, remove: removeProduct } = useBuildContext();
  const { productType, setProductType } = useProductType();
  const { products: productErrors } = useValidation();

  let details = context[product];
  if (!Array.isArray(details) && details) details = [details];

  return (
    <div
      key={product}
      className={`w-full space-y-2 px-4 py-1 rounded-lg ${
        productType === product
          ? "border-0"
          : "border-2 cursor-pointer hover:border-blue-500 dark:hover:bg-blue-500"
      }`}
      onClick={() => setProductType(product)}
    >
      <h2 className="text-lg font-semibold">{Product.Label[product]}</h2>
      <ul>
        {!details || details.length === 0 ? (
          <li>No product selected</li>
        ) : (
          details.map((detail) => (
            <ProductDetailComponent
              key={detail.name}
              details={detail}
              errors={productErrors[detail.id]}
              remove={productType ? removeProduct : undefined}
            />
          ))
        )}
      </ul>
    </div>
  );
}

function ProductDetailComponent({
  details,
  remove,
  errors,
}: {
  details: Part.Summary;
  errors?: { [key: string]: string[] };
  remove?: (details: Part.Summary) => void;
}) {
  return (
    <li key={details.name} className="relative">
      {details.name}
      {remove && <DeleteButton onClick={() => remove(details)} />}
      {errors && (
        <ul>
          {Object.entries(errors).map(([name, values]) => (
            <li>{`name: ${values.join(", ")}`}</li>
          ))}
        </ul>
      )}
    </li>
  );
}
