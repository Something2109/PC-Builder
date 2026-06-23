import Part, { Product } from "@pc-builder/shared/part";
import Link from "next/link";

import PartPicture from "./Picture";

export default function PartPanel({ item }: { item: Part.Summary }) {
  return (
    <Link
      href={`/part/${item.part}/${item.id}`}
      className="group flex flex-col rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:border-accent-indigo hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white/5 flex items-center justify-center p-2 mb-4">
        <PartPicture
          part={item.part}
          src={item.image_url ?? undefined}
          className="min-h-full min-w-full object-contain"
        />
      </div>

      <div className="flex flex-col grow justify-between text-left">
        <div>
          <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-accent-indigo/10 text-accent-indigo">
            {Product.Label[item.part as Product.Name]}
          </span>
          <h3 className="mt-2 text-sm font-bold text-text leading-snug line-clamp-2 group-hover:text-accent-indigo transition-colors duration-200">
            {item.name}
          </h3>
        </div>

        <div className="mt-4 pt-3 border-t border-border/50 flex flex-row justify-between items-center text-xs text-text/50">
          <span>
            Brand: <strong className="text-text/80">{item.brand}</strong>
          </span>
          <span className="text-accent-cyan font-semibold group-hover:underline">
            Details &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
