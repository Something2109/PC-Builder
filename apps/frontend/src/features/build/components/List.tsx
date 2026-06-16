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
    <div className="space-y-6">
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

  const RemoveButtonCell = ({
    defaultValue,
  }: {
    defaultValue?: Part.Summary;
  }) => (
    <td className="text-right p-3">
      {defaultValue && (
        <button
          type="button"
          onClick={() => removeProduct(defaultValue)}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-200"
        >
          Remove
        </button>
      )}
    </td>
  );

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="size-9 rounded-xl bg-accentIndigo/10 flex items-center justify-center">
          <Image
            src={`/images/icons/${product}.png`}
            alt=""
            width={20}
            height={20}
            className="dark:invert"
          />
        </div>
        <h3 className="text-lg font-bold tracking-tight text-text">
          {Product.Label[product]}
        </h3>
      </div>

      {/* Component Selection / Table */}
      <div className="w-full">
        {!details || details.length === 0 ? (
          <Link
            href={`/build/${product}`}
            className="flex items-center justify-center gap-2 w-full py-5 border border-dashed border-border hover:border-accentCyan rounded-xl text-text/50 hover:text-accentCyan bg-slate-50/5 hover:bg-slate-50/10 transition-all duration-200 text-sm font-semibold"
          >
            + Choose {Product.Label[product]}
          </Link>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden bg-slate-50/5">
            <SummaryTable
              part={product}
              data={details}
              Cells={[RemoveButtonCell]}
            />
          </div>
        )}

        {/* Error Messages */}
        {errors[product] && (
          <div className="mt-3 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-semibold flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-red-500" />
            {errors[product]}
          </div>
        )}

        {/* Add Another (for multiple items support) */}
        {addable && details && details.length > 0 && (
          <div className="mt-3">
            <Link
              href={`/build/${product}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-border bg-card hover:bg-line/10 rounded-xl text-xs font-semibold transition-colors text-text/80 hover:text-text"
            >
              + Add another {Product.Label[product]}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
