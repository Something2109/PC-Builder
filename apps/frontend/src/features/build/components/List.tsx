"use client";

import Image from "next/image";
import Link from "next/link";
import { useBuildContext } from "@/features/build/hooks/BuildContext";
import { useValidation } from "@/features/build/hooks/Validation";
import SummaryTable from "@/features/part/components/Summary";
import Part, { Product, Products } from "@/utils/part";

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
    <div className="space-y-4">
      {ProductRenderOrder.map((product) => (
        <ProductTypeComponent key={product} product={product} />
      ))}
    </div>
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
  const hasError = Boolean(errors[product]);

  const cardBorderClass = hasError
    ? "border-red-500/30 ring-1 ring-red-500/10 bg-red-500/2 shadow-xs shadow-red-500/5"
    : "border-border hover:border-accent-indigo/40 hover:shadow-md";

  const RemoveButtonCell = ({ defaultValue }: { defaultValue?: Part.Summary }) => (
    <td className="text-right p-3">
      {defaultValue && (
        <button
          type="button"
          onClick={() => removeProduct(defaultValue)}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
        >
          Remove
        </button>
      )}
    </td>
  );

  return (
    <div className={`w-full rounded-2xl border p-5 shadow-xs transition-all duration-300 bg-card ${cardBorderClass}`}>
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="size-9 rounded-xl bg-accent-indigo/10 flex items-center justify-center">
          <Image
            src={`/images/icons/${product}.png`}
            alt=""
            width={20}
            height={20}
            className="dark:invert"
          />
        </div>
        <h3 className="text-lg font-bold tracking-tight text-text">{Product.Label[product]}</h3>
      </div>

      {/* Component Selection / Table */}
      <div className="w-full">
        {!details || details.length === 0 ? (
          <Link
            href={`/build/${product}`}
            className="flex items-center justify-center gap-2 w-full py-6 border border-dashed border-border/80 hover:border-accent-indigo hover:text-accent-indigo rounded-2xl text-text/40 hover:text-accent-indigo bg-slate-500/2 hover:bg-accent-indigo/5 transition-all duration-250 text-sm font-bold cursor-pointer group"
          >
            <span className="text-base group-hover:scale-120 transition-transform duration-250">+</span> Choose {Product.Label[product]}
          </Link>
        ) : (
          <div className="border border-border/60 rounded-xl overflow-hidden bg-slate-50/5">
            <SummaryTable part={product} data={details} Cells={[RemoveButtonCell]} />
          </div>
        )}

        {/* Error Messages */}
        {hasError && errors[product] && (
          <div className="mt-3 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-semibold flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>{errors[product]}</span>
          </div>
        )}

        {/* Add Another (for multiple items support) */}
        {addable && details && details.length > 0 && (
          <div className="mt-3">
            <Link
              href={`/build/${product}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border bg-card hover:bg-accent-indigo/5 hover:text-accent-indigo rounded-lg text-xs font-bold transition-all text-text/70 hover:border-accent-indigo/40 cursor-pointer"
            >
              + Add another {Product.Label[product]}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
