"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Article, Content, ContentName, ArticleStatus } from "@/utils/article";
import { RowWrapper } from "@/ui/FlexWrapper";
import axios, { AxiosError } from "axios";
import { mergeClass } from "@/ui/mergeClass";
import { uploadFile } from "./utils";
import { ContentListComponent } from "./input";
import { AutoGrowingTextArea } from "@/ui/Input";

const PRESET_COVERS = [
  "linear-gradient(to right, #8b5cf6, #6366f1)", // Indigo Purple
  "linear-gradient(to right, #f97316, #ec4899)", // Pink Sunset
  "linear-gradient(to right, #14b8a6, #10b981)", // Green Teal
  "linear-gradient(to right, #475569, #1e293b)", // Steel Dark
  "linear-gradient(to right, #f59e0b, #e11d48)", // Sunfire
];

const PRESET_EMOJIS = [
  "📝",
  "💻",
  "⚙️",
  "🚀",
  "💡",
  "🔧",
  "📦",
  "🔋",
  "🖥️",
  "📁",
  "📖",
  "🎨",
  "🛠️",
  "🔌",
  "📊",
  "🔥",
  "✨",
  "🧠",
];

interface EditableArticleProps {
  article: Article;
  isNew?: boolean;
}

function EditableArticle({ article, isNew = false }: EditableArticleProps) {
  const router = useRouter();
  const articleId = article.id;

  // Track visual metadata states
  const [title, setTitle] = useState(article.title);
  const [standfirst, setStandfirst] = useState(article.standfirst);
  const [cover, setCover] = useState<string | undefined>(article.cover);
  const [icon, setIcon] = useState<string | undefined>(article.icon);
  const [topic, setTopic] = useState<string | undefined>(article.topic);
  const [part, setPart] = useState<string | undefined>(article.part);
  const [contents, setContents] = useState<Content[]>(article.content || []);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCoverSelector, setShowCoverSelector] = useState(false);
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const handlePresetCover = (preset: string) => {
    setCover(preset);
    setShowCoverSelector(false);
  };

  const handleCustomCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCoverUploading(true);
    try {
      const url = await uploadFile(file, "covers");
      setCover(url);
      setShowCoverSelector(false);
    } catch (err) {
      console.error("Failed to upload cover:", err);
      alert("Cover image upload failed.");
    } finally {
      setIsCoverUploading(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setIcon(emoji);
    setShowEmojiPicker(false);
  };

  // Submit Handler (Saves Draft or Publishes)
  const handleSave = async (submitStatus: ArticleStatus) => {
    if (isSaving) return;

    if (!title.trim() || title.length < 3) {
      alert("Title must be at least 3 characters long.");
      return;
    }

    setIsSaving(true);

    const payload = {
      title,
      standfirst,
      cover,
      icon,
      status: submitStatus,
      topic: topic || undefined,
      part: part || undefined,
      content: contents,
      author: article.author || "admin",
    };

    try {
      let response;
      if (isNew) {
        let createUrl = "/api/article";
        const queryParams = new URLSearchParams();
        if (topic) queryParams.set("topic", topic);
        if (part) queryParams.set("part", part);
        if (queryParams.toString()) {
          createUrl += `?${queryParams.toString()}`;
        }

        response = await axios.post(createUrl, payload, {
          withCredentials: true,
        });

        const createdArticle = response.data;
        router.push(`/article/${createdArticle.slug || createdArticle.id}`);
      } else {
        response = await axios.put(`/api/article/${articleId}`, payload, {
          withCredentials: true,
        });

        const updatedArticle = response.data;
        router.push(`/article/${updatedArticle.slug || updatedArticle.id}`);
      }

      router.refresh();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message =
        error.response?.data?.message ||
        "An error occurred while saving the article.";
      alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete (Edit Mode Only)
  const handleDelete = async () => {
    if (isNew) return;
    if (!confirm("Are you sure you want to delete this article?")) return;
    setIsSaving(true);
    try {
      await axios.delete(`/api/article/${articleId}`, {
        withCredentials: true,
      });
      router.push("/article");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete article:", error);
      alert("Failed to delete article.");
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-1 md:px-4 pb-24">
      {/* Editor Cover area */}
      <div className="relative w-full h-[200px] md:h-[260px] rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-inner group">
        {cover ? (
          cover.startsWith("linear-gradient") ? (
            <div className="w-full h-full" style={{ background: cover }} />
          ) : (
            <img
              src={cover}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="w-full h-full bg-slate-100/50 dark:bg-slate-950/20 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400">No cover image</span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2 backdrop-blur-[1px]">
          <button
            type="button"
            onClick={() => setShowCoverSelector(!showCoverSelector)}
            className="bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 hover:bg-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md transition-colors"
          >
            Change Cover
          </button>
          {cover && (
            <button
              type="button"
              onClick={() => setCover(undefined)}
              className="bg-red-600/90 text-white hover:bg-red-600 text-xs font-semibold px-4 py-2 rounded-xl shadow-md transition-colors"
            >
              Remove Cover
            </button>
          )}
        </div>

        {showCoverSelector && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-20">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 max-w-sm w-full space-y-4 shadow-xl">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Choose Cover Layout
              </h4>

              <div className="grid grid-cols-5 gap-2">
                {PRESET_COVERS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetCover(preset)}
                    className="h-10 rounded-lg shadow-sm border border-black/10"
                    style={{ background: preset }}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <input
                  type="file"
                  accept="image/*"
                  ref={coverFileInputRef}
                  className="hidden"
                  onChange={handleCustomCover}
                />
                <button
                  type="button"
                  disabled={isCoverUploading}
                  onClick={() => coverFileInputRef.current?.click()}
                  className="w-full text-center py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-xs rounded-xl transition-colors disabled:opacity-50"
                >
                  {isCoverUploading
                    ? "Uploading cover..."
                    : "Upload custom photo"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCoverSelector(false)}
                  className="w-full text-center py-2 hover:bg-slate-100 text-slate-500 font-medium text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Emoji Icon Selector */}
        <div className="absolute -bottom-10 left-8 md:left-12 z-10">
          {icon ? (
            <div
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="flex items-center justify-center text-5xl bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 rounded-full w-20 h-20 shadow-lg cursor-pointer hover:rotate-6 hover:scale-105 transition-all select-none"
              title="Change icon"
            >
              {icon}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="flex items-center justify-center text-xs font-semibold bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-md hover:bg-slate-50 cursor-pointer"
            >
              😀 Add Icon
            </button>
          )}

          {showEmojiPicker && (
            <div className="absolute bottom-24 left-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xl z-20 w-64 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select Emoji
              </h4>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleEmojiSelect(emoji)}
                    className="text-2xl hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                {icon && (
                  <button
                    type="button"
                    onClick={() => {
                      setIcon(undefined);
                      setShowEmojiPicker(false);
                    }}
                    className="grow text-center py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-[10px] rounded-lg transition-colors"
                  >
                    Remove Icon
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(false)}
                  className="grow text-center py-1.5 hover:bg-slate-100 text-slate-400 font-medium text-[10px] rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editing Canvas */}
      <div className={mergeClass("pt-16 px-4 md:px-12", !icon ? "pt-8" : "")}>
        {/* Topic and part metadata inputs */}
        <div className="flex flex-wrap items-center gap-3 mb-6 text-xs bg-slate-50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Topic:</span>
            <input
              type="text"
              placeholder="e.g. introduction, guide"
              defaultValue={topic}
              onChange={(e) => setTopic(e.target.value || undefined)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-slate-700 dark:text-slate-200 focus:outline-none placeholder-slate-300 font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Part Category:</span>
            <input
              type="text"
              placeholder="e.g. cpu, ram"
              defaultValue={part}
              onChange={(e) => setPart(e.target.value || undefined)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-slate-700 dark:text-slate-200 focus:outline-none placeholder-slate-300 font-medium uppercase"
            />
          </div>
        </div>

        {/* Title */}
        <AutoGrowingTextArea
          placeholder="Untitled Article"
          defaultValue={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-sans text-3xl md:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight mb-4 my-2 placeholder-slate-200 dark:placeholder-slate-800"
        />

        {/* Standfirst */}
        <AutoGrowingTextArea
          placeholder="Write a short, engaging standfirst introduction..."
          defaultValue={standfirst}
          onChange={(e) => setStandfirst(e.target.value)}
          className="font-serif text-lg text-slate-500 dark:text-slate-400 leading-relaxed italic border-l-4 border-slate-200 dark:border-slate-800 pl-4 mb-8 placeholder-slate-300 dark:placeholder-slate-800/80"
        />

        <hr className="border-slate-100 dark:border-slate-800 mb-6" />

        {/* Recursive Block List Editor */}
        <div className="space-y-2">
          <ContentListComponent
            parent={ContentName.Section}
            contents={contents}
            onUpdate={setContents}
          />
        </div>
      </div>

      {/* Floating Sticky Bottom Control Bar */}
      <div className="fixed bottom-6 left-0 right-0 z-40 px-4">
        <div className="max-w-xl mx-auto bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-xl px-5 py-3.5 flex items-center justify-between gap-4 text-white">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {isNew ? "Create mode" : "Edit mode"}
            </span>
            <span className="text-xs font-semibold text-slate-200 max-w-[120px] truncate">
              {title || "Untitled"}
            </span>
          </div>

          <RowWrapper className="items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>

            {!isNew && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSaving}
                className="py-1.5 px-3 border border-red-800 text-red-400 hover:bg-red-950/20 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSave(ArticleStatus.Draft)}
              disabled={isSaving}
              className="py-1.5 px-4 bg-amber-600 hover:bg-amber-700 text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Draft"}
            </button>

            <button
              type="button"
              onClick={() => handleSave(ArticleStatus.Published)}
              disabled={isSaving}
              className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              {isSaving ? "Publishing..." : isNew ? "Publish" : "Update"}
            </button>
          </RowWrapper>
        </div>
      </div>
    </div>
  );
}

export { EditableArticle };
