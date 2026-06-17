"use client";

import BuildProductList from "@/features/build/components/List";
import BuildValidateForm from "@/features/build/components/Form";
import BuildResultList from "@/features/build/components/Result";
import { useBuildContext } from "@/features/build/hooks/BuildContext";
import Part, { Products } from "@/utils/part";

export default function BuildPage() {
  const { details, clear } = useBuildContext();

  // Selected count
  const selectedCount = Object.keys(details).length;
  const totalCategories = 14;

  // Calculate PSU requirements & CPU TDP
  let cpuTdp = 0;
  if (details[Products.CPU]) {
    const cpu = details[Products.CPU] as Part.Summary<Products.CPU>;
    if (cpu.tdp) cpuTdp = Number(cpu.tdp);
  }

  let maxMinPsu = 0;
  if (details[Products.GRAPHIC_CARD]) {
    const gpus = (
      Array.isArray(details[Products.GRAPHIC_CARD])
        ? details[Products.GRAPHIC_CARD]
        : [details[Products.GRAPHIC_CARD]]
    ) as Part.Summary<Products.GRAPHIC_CARD>[];
    gpus.forEach((gpu) => {
      if (gpu.minimum_psu) {
        maxMinPsu = Math.max(maxMinPsu, Number(gpu.minimum_psu));
      }
    });
  }

  let selectedPsuWattage = 0;
  if (details[Products.PSU]) {
    const psu = details[Products.PSU] as Part.Summary<Products.PSU>;
    if (psu.wattage) selectedPsuWattage = Number(psu.wattage);
  }

  const hasPsuWarning = selectedPsuWattage > 0 && maxMinPsu > 0 && selectedPsuWattage < maxMinPsu;
  const hasPsuSuccess = selectedPsuWattage > 0 && maxMinPsu > 0 && selectedPsuWattage >= maxMinPsu;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-text">PC Build Planner</h1>
        <p className="text-sm text-text/60 mt-1">
          Select components, check real-time compatibility rules, and design your dream system.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <BuildProductList />
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
          {/* Build Overview Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-bold tracking-tight mb-4 text-text">Build Summary</h2>

            <div className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-text/75 mb-1.5">
                  <span>Selected Parts</span>
                  <span>
                    {selectedCount} / {totalCategories}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-accent-indigo transition-all duration-500 rounded-full"
                    style={{ width: `${(selectedCount / totalCategories) * 100}%` }}
                  />
                </div>
              </div>

              <hr className="border-border/60" />

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-xl border border-border/40 bg-slate-50/5">
                  <span className="text-xs text-text/50 block mb-0.5">CPU TDP</span>
                  <span className="font-bold text-text">{cpuTdp > 0 ? `${cpuTdp} W` : "—"}</span>
                </div>
                <div className="p-3 rounded-xl border border-border/40 bg-slate-50/5">
                  <span className="text-xs text-text/50 block mb-0.5">Min. PSU Required</span>
                  <span className="font-bold text-text">
                    {maxMinPsu > 0 ? `${maxMinPsu} W` : "—"}
                  </span>
                </div>
              </div>

              {/* PSU Sufficiency Check */}
              {selectedPsuWattage > 0 && (
                <div className="p-3.5 rounded-xl text-xs flex items-center justify-between border border-border/40 bg-slate-50/5 transition-all">
                  <div>
                    <span className="text-text/50 block mb-0.5">Selected PSU Capacity</span>
                    <span className="font-bold text-sm text-text">{selectedPsuWattage} W</span>
                  </div>
                  {hasPsuWarning && (
                    <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-bold">
                      Underpowered (Min {maxMinPsu}W)
                    </span>
                  )}
                  {hasPsuSuccess && (
                    <span className="px-2.5 py-1 rounded-full bg-mint/10 border border-mint/20 text-mint font-bold">
                      Sufficient
                    </span>
                  )}
                  {!hasPsuWarning && !hasPsuSuccess && (
                    <span className="px-2.5 py-1 rounded-full bg-text/10 border border-text/20 text-text/70 font-semibold">
                      Selected
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              {selectedCount > 0 && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={clear}
                    className="w-full text-center py-2.5 px-3 border border-red-500/20 hover:border-red-500/40 text-red-500/80 hover:text-red-500 bg-red-500/5 hover:bg-red-500/10 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer"
                  >
                    Reset Builder / Clear Parts
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Validation Form and Results */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-text">Compatibility</h2>
              <BuildValidateForm />
            </div>
            <BuildResultList />
          </div>
        </div>
      </div>
    </div>
  );
}
