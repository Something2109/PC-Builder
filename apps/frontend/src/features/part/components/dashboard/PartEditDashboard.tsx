"use client";

import Part, { Mapping, Products } from "@pc-builder/shared/part";
import { useState } from "react";

import { ResponsiveWrapper } from "@/ui/Layout/FlexWrapper";

import PartPicture from "../catalog/PartPicture";
import { InfoForm } from "../input/InfoForm";
import PartForm from "../input/Part";

interface PartEditDashboardProps {
  part: Products;
  id: string;
  defaultValue: Part.DTO;
  saveLink: string;
}

const getPartBadgeColor = (p: Products) => {
  switch (p) {
    case Products.CPU:
      return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
    case Products.GPU:
    case Products.GRAPHIC_CARD:
      return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
    case Products.MAIN:
      return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    case Products.RAM:
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case Products.SSD:
    case Products.HDD:
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    default:
      return "bg-slate-500/10 text-slate-500 border-slate-500/20";
  }
};

export default function PartEditDashboard({
  part,
  id,
  defaultValue,
  saveLink,
}: PartEditDashboardProps) {
  const [activeTab, setActiveTab] = useState<"general" | "specs">("general");
  const [imageUrl, setImageUrl] = useState<string | undefined>(defaultValue.image_url ?? undefined);

  const specsCount = (Mapping.Info[part]?.length as number) || 0;

  // Render the badge class based on the part type

  return (
    <div className="w-full min-h-screen py-6 px-1 lg:px-4">
      {/* Upper Navigation & Title breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-text/50 font-bold">
            Admin Console
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-text via-text/80 to-text/60 bg-clip-text text-transparent">
            Redesign Part Editor
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-text/60">
          <span>Parts</span>
          <span>/</span>
          <span className="capitalize">{part.toLowerCase()}</span>
          <span>/</span>
          <span className="font-semibold text-text/90 truncate max-w-50">{defaultValue.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Sidebar - Preview and Navigation */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          {/* Preview Card */}
          <div className="relative overflow-hidden bg-card/60 dark:bg-card/30 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:border-accent-indigo/30">
            {/* Soft decorative glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent-indigo/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative p-2 bg-background/50 dark:bg-background/20 rounded-xl border border-border/40 shadow-inner group overflow-hidden">
                <PartPicture
                  className="w-32 h-32 md:w-40 md:h-40 object-contain rounded-lg transition-transform duration-500 group-hover:scale-105"
                  part={part}
                  src={imageUrl}
                />
              </div>

              <div className="space-y-2 w-full">
                <span
                  className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getPartBadgeColor(part)}`}
                >
                  {part}
                </span>
                <h2 className="text-xl font-bold text-text line-clamp-2 px-2">
                  {defaultValue.name}
                </h2>
                <p className="text-xs text-text/40 font-mono">ID: {id}</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation Menu */}
          <div className="bg-card/60 dark:bg-card/30 backdrop-blur-xl border border-border/50 rounded-2xl shadow-md p-3">
            <nav className="flex flex-col space-y-1">
              <button
                onClick={() => setActiveTab("general")}
                className={`flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  activeTab === "general"
                    ? "bg-accent-indigo/10 text-accent-indigo dark:bg-accent-indigo/25 border-l-4 border-accent-indigo"
                    : "text-text/70 hover:bg-slate-500/5 hover:text-text"
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  <span>General Information</span>
                </div>
                <svg
                  className="w-4 h-4 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <button
                onClick={() => setActiveTab("specs")}
                className={`flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  activeTab === "specs"
                    ? "bg-accent-indigo/10 text-accent-indigo dark:bg-accent-indigo/25 border-l-4 border-accent-indigo"
                    : "text-text/70 hover:bg-slate-500/5 hover:text-text"
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Technical Specs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-slate-500/10 text-text/50 font-bold px-2 py-0.5 rounded-full border border-border/40">
                    {specsCount}
                  </span>
                  <svg
                    className="w-4 h-4 opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Right Content Panel */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === "general" ? (
            <div className="bg-card/60 dark:bg-card/30 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-6 md:p-8 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-6 pb-2 border-b border-border/40 text-text/90 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-accent-indigo"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Basic Fields & Core Information
              </h3>
              <PartForm path={saveLink} defaultValue={defaultValue} setImageUrl={setImageUrl} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-card/60 dark:bg-card/30 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-6 md:p-8">
                <h3 className="text-2xl font-bold mb-2 text-text/90 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-accent-indigo"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Technical Specification Modules
                </h3>
                <p className="text-sm text-text/60 mb-6 pb-2 border-b border-border/40">
                  Update specific categories of diagnostic or technical specifications. Each card
                  operates independently.
                </p>

                {specsCount === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border/60 rounded-xl">
                    <p className="text-text/50">
                      No specification modules available for this component.
                    </p>
                  </div>
                ) : (
                  <ResponsiveWrapper className="w-full align-top flex-wrap gap-6">
                    {Mapping.Info[part].map((info) => (
                      <div
                        key={info}
                        className="w-full bg-background/55 dark:bg-slate-900/10 rounded-xl p-4 border border-border/40 hover:border-accent-cyan/30 transition-all duration-300"
                      >
                        <InfoForm path={saveLink} info={info} defaultValue={defaultValue} />
                      </div>
                    ))}
                  </ResponsiveWrapper>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
