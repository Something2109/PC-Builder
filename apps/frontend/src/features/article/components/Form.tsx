"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

import { useCreateArticle } from "@/features/article/hooks/useCreateArticle";
import { useDeleteArticle } from "@/features/article/hooks/useDeleteArticle";
import { useUpdateArticle } from "@/features/article/hooks/useUpdateArticle";
import { useImageUpload } from "@/hooks/useImageUpload";
import { RowWrapper } from "@/ui/FlexWrapper";
import { Input, Select, AutoGrowingTextArea } from "@/ui/Input";
import { mergeClass } from "@/ui/mergeClass";
import { Article, Content, ContentName, ArticleStatus, BaseEditArticleDto } from "@pc-builder/shared/article";
import { Name as ProductName, Label as ProductLabel } from "@pc-builder/shared/part/product";

import { ContentListComponent } from "./input";

const articleFormSchema = BaseEditArticleDto;

const ensureIds = (list: Content[]): Content[] => {
  return list.map((item) => {
    const id = item.id || Math.random().toString(36).substring(2, 9);
    if (item.type === ContentName.Section || item.type === ContentName.List) {
      return {
        ...item,
        id,
        content: ensureIds(item.content || []),
      };
    }
    return { ...item, id };
  });
};

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

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCoverSelector, setShowCoverSelector] = useState(false);

  const { createArticle, isCreating } = useCreateArticle();
  const { updateArticle, isUpdating } = useUpdateArticle();
  const { deleteArticle, isDeleting } = useDeleteArticle();

  const isSaving = isCreating || isUpdating || isDeleting;

  const { upload: uploadCover, isUploading: isCoverUploading } = useImageUpload();

  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const submitStatusRef = useRef<ArticleStatus>(ArticleStatus.Draft);

  const form = useForm({
    defaultValues: {
      title: article.title,
      standfirst: article.standfirst || "",
      cover: article.cover,
      icon: article.icon,
      topic: article.topic,
      part: article.part,
      content: ensureIds(article.content || []) as unknown[],
      author: article.author || "admin",
    },
    onSubmit: async ({ value }) => {
      if (isSaving) return;
      const submitStatus = submitStatusRef.current;
      const payload = {
        ...value,
        status: submitStatus,
      };

      if (isNew) {
        const queryParams = new URLSearchParams();
        if (value.topic) queryParams.set("topic", value.topic);
        if (value.part) queryParams.set("part", value.part);
        await createArticle({ payload, queryParams });
      } else {
        await updateArticle({ id: articleId, payload });
      }
    },
  });

  const handlePresetCover = (preset: string) => {
    form.setFieldValue("cover", preset);
    setShowCoverSelector(false);
  };

  const handleCustomCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadCover(file, "covers");
      form.setFieldValue("cover", url);
      setShowCoverSelector(false);
    } catch (err) {
      console.error("Failed to upload cover:", err);
      alert("Cover image upload failed.");
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    form.setFieldValue("icon", emoji);
    setShowEmojiPicker(false);
  };

  const handleDelete = async () => {
    if (isNew) return;
    if (!confirm("Are you sure you want to delete this article?")) return;
    await deleteArticle(articleId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-1 md:px-4 pb-24">
      {/* Editor Cover area */}
      <div className="relative w-full h-50 md:h-65 rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-inner group">
        <form.Subscribe selector={(state) => state.values.cover}>
          {(cover) => (
            <>
              {cover ? (
                cover.startsWith("linear-gradient") ? (
                  <div className="w-full h-full" style={{ background: cover }} />
                ) : (
                  <img src={cover} alt="Cover" className="w-full h-full object-cover" />
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
                    onClick={() => form.setFieldValue("cover", undefined)}
                    className="bg-red-600/90 text-white hover:bg-red-600 text-xs font-semibold px-4 py-2 rounded-xl shadow-md transition-colors"
                  >
                    Remove Cover
                  </button>
                )}
              </div>
            </>
          )}
        </form.Subscribe>

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
                  {isCoverUploading ? "Uploading cover..." : "Upload custom photo"}
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
          <form.Subscribe selector={(state) => state.values.icon}>
            {(icon) => (
              <>
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
                            form.setFieldValue("icon", undefined);
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
              </>
            )}
          </form.Subscribe>
        </div>
      </div>

      {/* Editing Canvas */}
      <form.Subscribe selector={(state) => state.values.icon}>
        {(icon) => (
          <div className={mergeClass("pt-16 px-4 md:px-12", !icon ? "pt-8" : "")}>
            {/* Topic and part metadata inputs */}
            <div className="flex flex-wrap items-center gap-3 mb-6 text-xs bg-slate-50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-semibold">Topic:</span>
                <form.Field
                  name="topic"
                  validators={{
                    onChange: ({ value }) => {
                      const res = articleFormSchema.shape.topic.safeParse(value);
                      if (!res.success) {
                        return res.error.issues[0]?.message;
                      }
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <div>
                      <Input
                        name={field.name}
                        value={field.state.value ?? ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="text"
                        placeholder="e.g. introduction, guide"
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-slate-700 dark:text-slate-200 focus:outline-none placeholder-slate-300 font-medium"
                      />
                      {field.state.meta.errors.length > 0 && (
                        <div className="text-red-500 text-[10px] font-semibold mt-1">
                          {field.state.meta.errors.join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-semibold">Part Category:</span>
                <form.Field
                  name="part"
                  validators={{
                    onChange: ({ value }) => {
                      const res = articleFormSchema.shape.part.safeParse(value);
                      if (!res.success) {
                        return res.error.issues[0]?.message;
                      }
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <div>
                      <Select
                        name={field.name}
                        value={field.state.value ?? ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-slate-700 dark:text-slate-200 focus:outline-none font-medium"
                      >
                        <option value="">Select a part category</option>
                        {Object.values(ProductName).map((val) => (
                          <option key={val} value={val}>
                            {ProductLabel[val] || val.toUpperCase()}
                          </option>
                        ))}
                      </Select>
                      {field.state.meta.errors.length > 0 && (
                        <div className="text-red-500 text-[10px] font-semibold mt-1">
                          {field.state.meta.errors.join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>
            </div>

            {/* Title */}
            <form.Field
              name="title"
              validators={{
                onChange: ({ value }) => {
                  const res = articleFormSchema.shape.title.safeParse(value);
                  if (!res.success) {
                    return res.error.issues[0]?.message;
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="w-full">
                  <AutoGrowingTextArea
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Untitled Article"
                    className="font-sans text-3xl md:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight mb-2 my-2 placeholder-slate-200 dark:placeholder-slate-800"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="text-red-500 text-xs font-semibold mb-4 px-1">
                      {field.state.meta.errors.join(", ")}
                    </div>
                  )}
                </div>
              )}
            </form.Field>

            {/* Standfirst */}
            <form.Field
              name="standfirst"
              validators={{
                onChange: ({ value }) => {
                  const res = articleFormSchema.shape.standfirst.safeParse(value);
                  if (!res.success) {
                    return res.error.issues[0]?.message;
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="w-full">
                  <AutoGrowingTextArea
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Write a short, engaging standfirst introduction..."
                    className="font-serif text-lg text-slate-500 dark:text-slate-400 leading-relaxed italic border-l-4 border-slate-200 dark:border-slate-800 pl-4 mb-8 placeholder-slate-300 dark:placeholder-slate-800/80"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="text-red-500 text-xs font-semibold mb-4 px-1">
                      {field.state.meta.errors.join(", ")}
                    </div>
                  )}
                </div>
              )}
            </form.Field>

            <hr className="border-slate-100 dark:border-slate-800 mb-6" />

            {/* Recursive Block List Editor */}
            <div className="space-y-2">
              <form.Field
                name="content"
                validators={{
                  onChange: ({ value }) => {
                    const res = articleFormSchema.shape.content.safeParse(value);
                    if (!res.success) {
                      return res.error.issues[0]?.message;
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <ContentListComponent
                    parent={ContentName.Section}
                    contents={field.state.value as Content[]}
                    onUpdate={(newContents) => field.handleChange(newContents)}
                    isRoot={true}
                  />
                )}
              </form.Field>
            </div>
          </div>
        )}
      </form.Subscribe>

      {/* Floating Sticky Bottom Control Bar */}
      <div className="fixed bottom-6 left-0 right-0 z-40 px-4">
        <div className="max-w-xl mx-auto bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-xl px-5 py-3.5 flex items-center justify-between gap-4 text-white">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {isNew ? "Create mode" : "Edit mode"}
            </span>
            <form.Subscribe selector={(state) => state.values.title}>
              {(currentTitle) => (
                <span className="text-xs font-semibold text-slate-200 max-w-[120px] truncate">
                  {currentTitle || "Untitled"}
                </span>
              )}
            </form.Subscribe>
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
              onClick={() => {
                submitStatusRef.current = ArticleStatus.Draft;
                form.handleSubmit();
              }}
              disabled={isSaving}
              className="py-1.5 px-4 bg-amber-600 hover:bg-amber-700 text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Draft"}
            </button>

            <button
              type="button"
              onClick={() => {
                submitStatusRef.current = ArticleStatus.Published;
                form.handleSubmit();
              }}
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
