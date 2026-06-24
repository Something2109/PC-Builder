"use client";

import { Article, Content, ContentName } from "@pc-builder/shared/article";
import { Roles } from "@pc-builder/shared/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Guard } from "@/features/auth";
import axiosInstance from "@/lib/axios";
import { mergeClass } from "@/ui/mergeClass";

import { Picture } from "./display/Image";
import { List } from "./display/List";
import { Paragraph } from "./display/Paragraph";
import { Section } from "./display/Section";

const Components = {
  [ContentName.Paragraph]: Paragraph,
  [ContentName.Section]: Section,
  [ContentName.Image]: Picture,
  [ContentName.List]: List,
};

function ContentListComponent({
  contents,
  prefix,
  parent,
}: {
  contents: Content[];
  prefix?: string;
  parent: ContentName;
}) {
  let sectionCount = 1;
  return contents.map((content, index) => {
    const Component = Components[content.type];

    let sectionPrefix = undefined;
    if (parent === ContentName.List) {
      sectionPrefix = prefix;
    } else if (content.type === ContentName.Section) {
      sectionPrefix = `${prefix ?? ""}${sectionCount++}.`;
    }

    return (
      <Component
        content={content as never}
        prefix={sectionPrefix}
        key={content.id || `${content.type}-${index}`}
      >
        {"content" in content && typeof content.content !== "string" && (
          <ContentListComponent
            parent={content.type}
            contents={content.content}
            prefix={content.type === ContentName.List ? content.symbol : sectionPrefix}
          />
        )}
      </Component>
    );
  });
}

function calculateReadingTime(contents: Content[]): number {
  let words = 0;
  function count(items: Content[]) {
    for (const item of items) {
      if (item.type === ContentName.Paragraph) {
        words += item.content.split(/\s+/).length;
      } else if (item.type === ContentName.Section) {
        words += item.title.split(/\s+/).length;
        count(item.content);
      } else if (item.type === ContentName.List) {
        count(item.content);
      }
    }
  }
  count(contents);
  return Math.max(1, Math.ceil(words / 200));
}

function extractSections(
  contents: Content[],
  depth = 0
): { id: string; title: string; depth: number }[] {
  let sections: { id: string; title: string; depth: number }[] = [];
  for (const item of contents) {
    if (item.type === ContentName.Section) {
      sections.push({ id: item.id, title: item.title, depth });
      if (item.content) {
        sections = [...sections, ...extractSections(item.content, depth + 1)];
      }
    }
  }
  return sections;
}

function ArticleComponent({ article }: { article: Article }) {
  const router = useRouter();
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const sections = extractSections(article.content);
  const readingTime = calculateReadingTime(article.content);

  // Scroll Spy Observer to track active section in viewport
  useEffect(() => {
    if (sections.length === 0) return;

    const elements = sections
      .map((sec) => document.getElementById(sec.id))
      .filter(Boolean) as HTMLElement[];

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (visible.length > 0) {
        // Use the first visible section
        setActiveSectionId(visible[0].target.id);
      }
    };

    const observerOptions = {
      root: null,
      rootMargin: "-10% 0px -75% 0px", // triggers when heading is in top-quarter of viewport
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [article.content, sections]);

  // Handle Publish Action
  const handlePublish = async () => {
    if (isPublishing) return;
    setIsPublishing(true);
    try {
      await axiosInstance.post(`/article/${article.id}/publish`);
      router.refresh();
    } catch (error) {
      console.error("Failed to publish article:", error);
      alert("Failed to publish article. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle Delete Action
  const handleDelete = async () => {
    if (isDeleting) return;
    if (!confirm("Are you sure you want to delete this article?")) return;
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/article/${article.id}`);
      router.push("/article");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete article:", error);
      alert("Failed to delete article. Please try again.");
      setIsDeleting(false);
    }
  };

  const formattedDate = new Date(article.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="w-full max-w-6xl mx-auto my-6 px-1 md:px-4">
      {/* Cover Header */}
      <div className="relative w-full h-50 md:h-75 rounded-3xl overflow-hidden shadow-md group">
        {article.cover ? (
          <img
            src={article.cover}
            alt="Article cover"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-tr from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-60" />
            <span className="text-slate-700 dark:text-slate-600 font-mono tracking-widest text-xs select-none">
              PC BUILDER HUB
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />

        {/* Page Icon (Emoji Overlay) */}
        {article.icon && (
          <div className="absolute -bottom-10 left-6 md:left-12 flex items-center justify-center text-5xl md:text-6xl bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 rounded-full w-20 h-20 md:w-24 md:h-24 shadow-lg select-none hover:rotate-6 transition-transform">
            {article.icon}
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className={mergeClass("pt-16 pb-6 px-4 md:px-12", !article.icon ? "pt-8" : "")}>
        {/* Breadcrumb / Topic Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {article.topic && (
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full capitalize">
              {article.topic}
            </span>
          )}
          {article.part && (
            <>
              <span>/</span>
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full uppercase">
                {article.part}
              </span>
            </>
          )}

          {/* Status Badge */}
          {article.status !== "published" && (
            <span
              className={mergeClass(
                "ml-auto px-2.5 py-0.5 text-xs font-bold rounded-full border uppercase tracking-wider",
                article.status === "draft"
                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30"
                  : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30"
              )}
            >
              {article.status}
            </span>
          )}
        </div>

        {/* Title & Standfirst */}
        <h1 className="font-sans text-3xl md:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight mb-4">
          {article.title}
        </h1>
        {article.standfirst && (
          <p className="font-serif text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed italic border-l-4 border-slate-200 dark:border-slate-800 pl-4 mb-8">
            {article.standfirst}
          </p>
        )}

        {/* Horizontal Divider */}
        <hr className="border-slate-100 dark:border-slate-800 mb-8" />

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Left Column: Article Body Content */}
          <div className="lg:col-span-8 space-y-4">
            {article.content.length > 0 ? (
              <ContentListComponent parent={ContentName.Section} contents={article.content} />
            ) : (
              <div className="py-12 text-center text-slate-400">
                This article has no content yet.
              </div>
            )}
          </div>

          {/* Right Column: Sticky Metadata Sidebar & TOC */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24 h-fit">
            {/* Meta Card */}
            <div className="bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 md:p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Article Details
              </h3>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold select-none text-sm shadow-inner">
                  {article.author.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {article.author}
                  </p>
                  <p className="text-xs text-slate-400">Author</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/50 text-xs">
                <div>
                  <p className="text-slate-400">Published</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                    {formattedDate}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Read Time</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                    ~{readingTime} min
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Views</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                    {article.views || 0}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Status</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5 capitalize">
                    {article.status}
                  </p>
                </div>
              </div>

              {/* Admin Actions Panel */}
              <Guard roles={[Roles.ADMIN, Roles.GUEST]}>
                <div className="flex flex-col gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                  <Link
                    href={`/article/${article.id}/edit`}
                    className="flex justify-center items-center py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all font-semibold text-sm text-center text-slate-700 dark:text-slate-200"
                  >
                    Edit Article
                  </Link>

                  {article.status === "draft" && (
                    <button
                      type="button"
                      disabled={isPublishing}
                      onClick={handlePublish}
                      className="flex justify-center items-center py-2 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-colors text-center disabled:opacity-50"
                    >
                      {isPublishing ? "Publishing..." : "Publish Draft"}
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="flex justify-center items-center py-2 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-900/30 dark:hover:bg-red-600 transition-all font-semibold text-sm text-center disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete Article"}
                  </button>
                </div>
              </Guard>
            </div>

            {/* Table of Contents Sidebar */}
            {sections.length > 0 && (
              <div className="hidden lg:block space-y-4">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Table of Contents
                </h3>
                <nav className="flex flex-col border-l border-slate-100 dark:border-slate-800/80">
                  {sections.map((sec) => (
                    <Link
                      key={sec.id}
                      href={`#${sec.id}`}
                      className={mergeClass(
                        "py-1.5 pr-4 pl-4 text-sm transition-all border-l-2 -ml-px",
                        `${
                          sec.depth === 0
                            ? "font-semibold"
                            : "pl-8 text-xs text-slate-400 dark:text-slate-500"
                        } ${
                          activeSectionId === sec.id
                            ? "border-blue-500 text-blue-600 dark:text-blue-400 font-bold"
                            : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                        }`
                      )}
                    >
                      {sec.title}
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export { ArticleComponent };
