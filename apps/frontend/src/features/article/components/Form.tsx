"use client";

import {
  Article,
  ArticleStatus,
  ArticleBasicInfo,
  ArticleDto,
  ArticleBasicInfoSchema,
} from "@pc-builder/shared/article";
import { Name as ProductName } from "@pc-builder/shared/part/product";
import { useForm } from "@tanstack/react-form";
import { useRef, useMemo } from "react";

import { AutoGrowingTextArea, Input, OptionSelect } from "@/ui/Input";
import { GenericItemTreeStore } from "@/utils/tree";

import {
  ArticleTreeItemData,
  mapContentToTreeNodes,
  mapTreeNodesToContent,
} from "../utils/articleTreeMapper";
import { CoverInput, EmojiInput, SubmitBar } from "./form";
import { ContentListComponent } from "./input";

const extractArticleBasicInfo = (article: Article) => {
  const info: ArticleBasicInfo = {
    title: article.title ?? "",
    standfirst: article.standfirst ?? "",
    cover: article.cover,
    icon: article.icon,
    topic: article.topic,
    part: article.part,
  };

  return info;
};

interface EditableArticleProps {
  article: Article;
  isNew?: boolean;
  onSubmit: (payload: ArticleDto) => Promise<void>;
  onDelete?: () => Promise<void>;
  isSaving: boolean;
}

function EditableArticle({
  article,
  isNew = false,
  onSubmit,
  onDelete,
  isSaving,
}: EditableArticleProps) {
  const submitStatusRef = useRef<ArticleStatus>(ArticleStatus.Draft);

  const store = useMemo(() => {
    const nodes = mapContentToTreeNodes(article.content);
    return new GenericItemTreeStore<ArticleTreeItemData>(nodes);
  }, [article.content]); // Only once per component mount session

  const form = useForm({
    defaultValues: extractArticleBasicInfo(article),
    validators: {
      onChange: ({ value }) => {
        const res = ArticleBasicInfoSchema.safeParse(value);
        if (!res.success) {
          return res.error.issues[0]?.message;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      if (isSaving) return;
      const submitStatus = submitStatusRef.current;
      const content = mapTreeNodesToContent(store.tree.children);

      const payload: ArticleDto = {
        ...value,
        content,
        status: submitStatus,
      };
      await onSubmit(payload);
    },
  });

  return (
    <div className="w-full max-w-none my-6 px-4 md:px-12 pb-24">
      {/* Editor Cover area */}
      <div className="relative w-full h-50 md:h-65">
        <form.Subscribe selector={(state) => state.values.cover}>
          {(cover) => (
            <CoverInput value={cover} onChange={(val) => form.setFieldValue("cover", val)} />
          )}
        </form.Subscribe>

        <form.Subscribe selector={(state) => state.values.icon}>
          {(icon) => (
            <EmojiInput value={icon} onChange={(val) => form.setFieldValue("icon", val)} />
          )}
        </form.Subscribe>
      </div>

      {/* Editing Canvas */}
      <div className="pt-16 px-4 md:px-12">
        {/* Topic and part metadata inputs */}
        <div className="flex flex-wrap items-center gap-3 mb-6 text-xs bg-slate-50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">Topic:</span>
            <form.Field name="topic">
              {(field) => (
                <div>
                  <Input
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      field.handleChange(e.target.value)
                    }
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
            <form.Field name="part">
              {(field) => (
                <div>
                  <OptionSelect
                    name={field.name}
                    value={field.state.value ?? ""}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      field.handleChange(e.target.value)
                    }
                    options={Object.values(ProductName)}
                    placeholder="Select a part category"
                    className="min-w-45"
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
        </div>

        {/* Title */}
        <form.Field name="title">
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
        <form.Field name="standfirst">
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
          <ContentListComponent store={store} />
        </div>
      </div>

      {/* Floating Sticky Bottom Control Bar */}
      <form.Subscribe selector={(state) => state.values.title}>
        {(title) => (
          <SubmitBar
            title={title}
            isNew={isNew}
            isSaving={isSaving}
            onDelete={onDelete}
            onSubmit={(status) => {
              submitStatusRef.current = status;
              form.handleSubmit();
            }}
          />
        )}
      </form.Subscribe>
    </div>
  );
}

export { EditableArticle };
