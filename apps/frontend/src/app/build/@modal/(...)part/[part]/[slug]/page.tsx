import { getBackendUrl } from "@pc-builder/shared";
import Part, { Products, Mapping } from "@pc-builder/shared/part";
import { notFound } from "next/navigation";
import React from "react";

import { PartTable } from "@/features/part/components/detail/Part";
import { InfoTable } from "@/features/part/components/Table";
import InterceptedRouteModal from "@/components/ui/Modal/InterceptedRouteModal";

export default async function PartDetailPageModal({
  params,
}: {
  params: Promise<{ part: Products; slug: string }>;
}) {
  const { part, slug } = await params;

  const response = await fetch(getBackendUrl(`/api/part/${part}/${slug}`));

  if (!response.ok) return notFound();

  const data = (await response.json()) as Part.Model;

  return (
    <InterceptedRouteModal title={data.name}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (Sticky Product Card) */}
        <div className="lg:col-span-1">
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
    </InterceptedRouteModal>
  );
}
