"use client";

import { useBuildContext } from "@/components/hook/build/BuildContext";
import { useValidation } from "@/components/hook/build/Validation";
import SummaryTable from "@/components/part/Summary";
import { Button, RedirectButton } from "@/components/utils/Button";
import Part, { Product } from "@/utils/interface/part";
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
  const {
    result: { products: errors },
  } = useValidation();

  let details = context[product];
  if (!Array.isArray(details) && details) details = [details];

  const addable = !context[product] || Array.isArray(context[product]);

  const RemoveButtonCell = ({
    defaultValue,
  }: {
    defaultValue?: Part.Summary;
  }) => (
    <td className="relative">
      {defaultValue && (
        <Button onClick={() => removeProduct(defaultValue)}>Remove</Button>
      )}
    </td>
  );

  return (
    <div className="w-full space-y-2 px-4 py-1 rounded-lg border-2">
      <h1 className="text-xl font-bold">{`${Product.Label[product]}`}</h1>
      <ul className="*:mt-2">
        {!details || details.length === 0 ? (
          <li>No product selected</li>
        ) : (
          <SummaryTable
            part={product}
            data={details}
            Cells={[RemoveButtonCell]}
          />
        )}
        {errors[product] && <li className="text-red-500">{errors[product]}</li>}
        {addable && (
          <li>
            <RedirectButton href={`/build/${product}`}>Add</RedirectButton>
          </li>
        )}
      </ul>
    </div>
  );
}
