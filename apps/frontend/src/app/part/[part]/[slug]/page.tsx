import Part, { Products, Mapping, Product } from "@pc-builder/shared/part";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

import { PartTable } from "@/features/part/components/detail/Part";
import { InfoTable } from "@/features/part/components/Table";
import { getBackendUrl } from "@/utils/api";

export default async function PartDetailPage({
  params,
}: {
  params: Promise<{ part: Products; slug: string }>;
}) {
  const { part, slug } = await params;

  const response = await fetch(getBackendUrl(`/api/part/${part}/${slug}`));

  if (!response.ok) return notFound();

  const data = (await response.json()) as Part.Model;

  return (
    <div className="w-full space-y-6">
      {/* Breadcrumbs */}
      <div className="border-b border-border pb-5">
        <Link
          href={`/part/${part}`}
          className="text-xs font-bold text-accent-indigo hover:text-accent-indigo/80 flex items-center gap-1 mb-2 transition-colors uppercase tracking-wider"
        >
          &larr; Back to {Product.Label[part]} Directory
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-text">Hardware Showcase</h1>
      </div>

      {/* Two-Column Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (Sticky Product Card) */}
        <div className="lg:col-span-1 lg:sticky lg:top-24">
          <PartTable defaultValue={data} />
        </div>

        {/* Right Column (Detailed Specs Tables) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border-b border-border/60 pb-2 mb-4">
            <h2 className="text-xl font-bold tracking-tight text-text">
              Detailed Technical Specifications
            </h2>
          </div>
          <div className="space-y-4">
            {Mapping.Info[part].map((info) => (
              <InfoTable key={info} info={info} defaultValue={data[info]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
