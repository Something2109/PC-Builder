import Link from "next/link";

import Part, { Infos, Product } from "@pc-builder/shared/part";

import PartPicture from "../Picture";
import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<
  Omit<Part.DTO, "id" | "part" | "name" | "url" | "image_url" | Infos>
> = {
  code_name: ({ defaultValue: value }) => value,
  brand: ({ defaultValue: value }) => value,
  series: ({ defaultValue: value }) => value,
  launch_date: ({ defaultValue: value }) =>
    new Date(value ?? new Date()).toISOString().slice(0, 10),
};

const PartInfo = InfoComponent(Components, Part.Label);

export function PartTable({
  defaultValue,
  className,
}: {
  defaultValue: Part.Model;
  className?: string;
}) {
  const { id, part, url } = defaultValue;

  return (
    <div
      className={`flex flex-col border border-border bg-card p-6 rounded-2xl shadow-sm items-center ${className}`}
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full max-w-50 rounded-2xl overflow-hidden bg-white/5 flex items-center justify-center p-3 mb-5 border border-border/40">
        <PartPicture
          part={part ?? "default"}
          src={defaultValue.image_url ?? undefined}
          className="min-h-full min-w-full object-contain"
        />
      </div>

      {/* Product Category Badge */}
      <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-accent-indigo/10 text-accent-indigo mb-2">
        {Product.Label[part as Product.Name]}
      </span>

      {/* Product Name */}
      <h1 className="text-xl font-extrabold tracking-tight text-text mb-4 text-center leading-snug">
        {defaultValue.name}
      </h1>

      {/* Specifications Summary */}
      <div className="w-full text-left">
        <PartInfo defaultValue={defaultValue} />
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2 mt-6">
        {url ? (
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full block text-center py-2.5 px-4 bg-accent-indigo hover:bg-accent-indigo/90 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            Visit Official Brand Page &rarr;
          </Link>
        ) : null}

        <Link
          href={`/part/${part}/${id}/edit`}
          className="w-full block text-center py-2.5 px-4 border border-border hover:border-accent-indigo/30 bg-card hover:bg-accent-indigo/5 text-text/80 hover:text-accent-indigo font-bold text-xs rounded-xl transition-all duration-200 cursor-pointer"
        >
          Edit Component Details
        </Link>
      </div>
    </div>
  );
}
