"use client";

import { ColumnWrapper, ResponsiveWrapper } from "@/ui/FlexWrapper";

import { CrawlerControlProvider } from "../hooks/useCrawlerControl";
import CrawlerHeader from "./CrawlerHeader";
import ErrorBanner from "./ErrorBanner";
import InteractiveToolsSection from "./InteractiveToolsSection";
import ScrapersGrid from "./ScrapersGrid";
import SessionMonitorSection from "./SessionMonitorSection";

export default function CrawlerControl() {
  return (
    <CrawlerControlProvider>
      <CrawlerControlContent />
    </CrawlerControlProvider>
  );
}

function CrawlerControlContent() {
  return (
    <ColumnWrapper className="w-full gap-6 p-4 md:p-6 text-line bg-slate-900/40 rounded-xl backdrop-blur-md border border-slate-700/50 shadow-2xl">
      <CrawlerHeader />

      <ErrorBanner />

      {/* Main Responsive Grid Layout */}
      <ResponsiveWrapper className="w-full gap-6 items-start">
        {/* Left Column: Scrapers Grid & Session Monitor */}
        <ColumnWrapper className="basis-2/3 gap-6 w-full">
          <ScrapersGrid />
          <SessionMonitorSection />
        </ColumnWrapper>

        {/* Right Column: Interactive Debug / Testing Tools */}
        <ColumnWrapper className="basis-1/3 gap-6 w-full">
          <InteractiveToolsSection />
        </ColumnWrapper>
      </ResponsiveWrapper>
    </ColumnWrapper>
  );
}
